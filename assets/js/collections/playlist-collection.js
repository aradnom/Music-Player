
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

			// Content
			var text = new paper.PointText( { x: paper.view.center.x + 36, y: paper.view.center.y + 20 } );
		    text.content = track.attributes.artist + ' - ' + track.attributes.title;
		    text.characterStyle = {
		        font: 'Fjalla One',
		        fontSize: 12
		    }

		    // Create the icon background
			var rectangle = new paper.Rectangle( new paper.Point( paper.view.center.x - 2, paper.view.center.y - 2 ), new paper.Size( 34, 34 ) );
			var rectPath = new paper.Path.Rectangle( rectangle );
			rectPath.strokeColor = new paper.RgbColor( 0.15, 0.15, 0.15 );
			rectPath.fillColor = new paper.RgbColor( 0.1, 0.1, 0.1 );

		    // Create the track icon
		    var icon = new paper.Raster( $('.track[cache-id="' + _.hash( track.attributes.artist + track.attributes.title ) + '"] .track-icon')[0] );
		    icon.position = new paper.Point( paper.view.center.x + 15, paper.view.center.y + 15 );
		    icon.size = new paper.Size( 30, 30 );

		    // Put the play icon over the icon
		    var playIcon = new paper.Raster( $('#canvas-assets #icon-play')[0] );
		    playIcon.position = new paper.Point( paper.view.center.x + 15, paper.view.center.y + 15 );
		    playIcon.size = new paper.Size( 20, 20 );

			// Create the track group
			var trackGroup = new paper.Group([ rectPath, text, icon, playIcon ]);

			// Set up track events

			playIcon.onClick = function () {
				console.log( 'click' );
				Player.Controls.Play( track );
			}

			trackGroup.onMouseEnter = function () {
				//console.log( 'whatever' );
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
			//var tool = new paper.Tool();
			trackGroup.tool.onMouseUp = function ( event ) {
				paper.view.physicsObject = this.parent; // Set the parent as an active physics object
			}		

			trackGroup.onMouseDrag = function (event) {
				// Save the last delta as the instantaneous velocity for use later
				this.velocity = event.delta;

				var newPosition = {
					x: this.position.x + event.delta.x,
					y: this.position.y + event.delta.y
				}
				
				if ( this.withinBounds( newPosition ) )
					this.position = newPosition; // Update the current position
			}

		},

		// Override the sync function to cache the collection's models locally
		save : function () {
			this.sync();
		}


	});

	Player.Playlist = new Player.Collections.PlaylistCollection;

});