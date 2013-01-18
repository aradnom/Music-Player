
$( function () {

	Player.Collections.PlaylistCollection = Backbone.Collection.extend({

		model : Player.Models.Track,

		// Create a local cache for items in the playlist itself (canvas + list)
		windowStore : new Backbone.windowStore( 'playlist' ),

		initialize : function () { 
			
			// Bind playlist events
			this.on( 'add', function ( track ) {
				// Add to the playlist... list... thing
				this.addToList( track );

				// Add to the canvas
				this.addToCanvas( track );				
			});

		},

		addToList : function ( track ) {
			var view = new Player.Views.TrackView({ model: track, type: 'cache' });

			// Add the track to the playlist cache for canvas
			$('#playlist-cache').append( view.render( 'track' ).el );

			// Add the track to the list
		},

		addToCanvas : function ( track ) {

			var playlist = this;
			var position = paper.view.center;

			// Content
			var text = new paper.PointText( { x: position.x + 36, y: position.y + 20 } );
		    text.content = track.attributes.artist + ' - ' + track.attributes.title;
		    text.characterStyle = {
		        font: 'Fjalla One',
		        fontSize: 12
		    }

		    // Create the icon background
			var rectangle = new paper.Rectangle( new paper.Point( position.x - 2, position.y - 2 ), new paper.Size( 34, 34 ) );
			var rectPath = new paper.Path.Rectangle( rectangle );
			rectPath.strokeColor = new paper.RgbColor( 0.15, 0.15, 0.15 );
			rectPath.fillColor = new paper.RgbColor( 0.1, 0.1, 0.1 );

		    // Create the track icon
		    var icon = new paper.Raster( $('.track[cache-id="' + _.hash( track.attributes.artist + track.attributes.title ) + '"] .track-icon')[0] );
		    icon.position = new paper.Point( position.x + 15, position.y + 15 );
		    icon.size = new paper.Size( 30, 30 );

		    // Put the play icon over the icon
		    var playIcon = new paper.Raster( $('#canvas-assets #icon-play')[0] );
		    playIcon.position = new paper.Point( position.x + 15, position.y + 15 );
		    playIcon.size = new paper.Size( 20, 20 );

			// Create the track group and set the position at the middle of the canvas
			var trackGroup = new paper.Group([ rectPath, text, icon, playIcon ]);

			// Link this track with others in the same group

			_.each( this.models, function ( el ) {				
				if ( el != track ) {
					trackGroup.connector = new paper.Path.Line( position, el.paperGroup.position );
					trackGroup.connector.strokeColor = new paper.RgbColor( 0.15, 0.15, 0.15 );	
					trackGroup.connector.moveBelow( trackGroup );
					trackGroup.connector.moveBelow( el.paperGroup );		
				}							
			});

			// Events

			//var dragging = false; // Dragging flag so we can tell the difference between play click and drag

			playIcon.onClick = function () {
				if ( ! track.paperGroup.dragging )
					Player.Controls.Play( track );
			}

			trackGroup.onMouseEnter = function () {
				$(paper.view.element).css( 'cursor', 'pointer' );
			}

			trackGroup.onMouseLeave = function () {
				$(paper.view.element).css( 'cursor', '' );
			}
			
			trackGroup.onMouseDown = function ( event ) {
				this.tool.parent = this; // Save a reference to the parent before dragging

				offset = { // Save this for calculating the offset between click and group center
					x: event.point.x - this.bounds.x,
					y: event.point.y - this.bounds.y
				};
			}

			// This is a tool because item.onMouseUp will not reliably track the event
			trackGroup.tool.onMouseUp = function ( event ) {
				//paper.view.physicsObject = this.parent; // Set the parent as an active physics object
				this.parent.dragging = false;
			}		

			trackGroup.onMouseDrag = function (event) {
				this.dragging = true;

				// Save the last delta as the instantaneous velocity for use later
				this.velocity = event.delta;

				var newPosition = {
					x: this.position.x + event.delta.x,
					y: this.position.y + event.delta.y
				}
				
				if ( ! this.outOfBounds( newPosition ) )
					this.position = newPosition; // Update the current position

				_.each( playlist.models, function ( el ) {				
					if ( el != track ) {
						trackGroup.connector.segments[0].point = new paper.Point( 
							newPosition.x - ( trackGroup.bounds.width / 2 ) + 20,
							newPosition.y
						);
						trackGroup.connector.segments[1].point = new paper.Point( 
							el.paperGroup.position.x - ( el.paperGroup.bounds.width / 2 ) + 20, 
							el.paperGroup.position.y 
						);						
					}							
				});
			}

			// Set up physics
			if ( trackGroup.gravity )
				trackGroup.acceleration = {
					x: trackGroup.acceleration.x + paper.physics.options.gravity.x,
					y: trackGroup.acceleration.y + paper.physics.options.gravity.y
				}

			// Save a special reference to the icon because all the collisions reference it's position
			trackGroup.icon = icon;

			// Add the new group into the paper physics queue
			paper.physics.queue.push( trackGroup );

			// Save a ref to the track group to the track itself for reference later
			track.paperGroup = trackGroup;

		},

		// Override the sync function to cache the collection's models locally
		save : function () {
			this.sync();
		}

	});

	Player.Playlist = new Player.Collections.PlaylistCollection;

});