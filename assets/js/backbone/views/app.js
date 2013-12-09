// Where the magic happens

var Player = ( function ( player ) {	

	player.Views.App = Backbone.View.extend({
		
		el: $('body'),

		attributes: {
			activePlayer: null			
		},

		initialize: function () {

			// Starting variables
			var _this = this;

			// Stuff that should always happen
			this.globalSetup();

			// Authenticate with Spotify for streaming
			// Don't do anything else if this doesn't work because we need at least at least
			// one streaming API or this will be a very short trip
			this.setupSpotify( function () {
				player.Config.streaming.spotify = player.Spotify;

				// Initialize the canvas playlist
				_this.setupCanvas();

				// Setup jPlayer (used for custom server streams like Spotify)
				_this.setupjPlayer();
			});

		},

		events: {
			
		},

		globalSetup: function () {
			// Copyright
			var now = new Date;
			$('.copyright__year').text( now.getUTCFullYear() );
		},

		// Standard controls - can be used from anywhere in the app and handle logic
		// such as figuring out a play source. These are just aliases of the below
		// for convenience
		Controls: {

			TurnOn: function () {
				$('.controls').addClass( 'on' );
			},

			TurnOff: function () {
				$('.controls').removeClass( 'on' );
			},

			Play: function ( track ) {
			},

			Stop: function () {
			},

			Next: function () {
			},

			Previous: function () {
			}

		},

		// Track title, duration, that kind of thing
		Meta: {
			TurnOn: function () {
				$('.meta').addClass( 'on' );
			},

			TurnOff: function () {
				$('.meta').removeClass( 'on' );
			},

			SetTitle: function ( title ) {
				$('.meta__title').text( title );
			}
		},

		// Will attempt to play track via the specified service.  This means it will
		// the service's PlayTrack function with the track, so the track must be the correct
		// format for the service
		PlayTrack: function ( track, artist, title, service ) {
			player.Config.streaming[service].PlayTrack( track );

			if ( artist || title ) {
				player.App.Meta.TurnOn();
				player.App.Meta.SetTitle( artist + ' - ' + title );
			}
		},

		addTrackToPlaylist: function ( event ) {

			var trackEl = $(event.currentTarget).parents('.track');			
			track = this.retrieveFromCache( trackEl.children('.track-artist').html(), trackEl.children('.track-title').html() );

			if ( track ) Player.Playlist.create( track.attributes );

		},

		playFromSearch: function ( event ) {

			var trackEl = $(event.currentTarget).parents('.track');			
			track = this.retrieveFromCache( trackEl.children('.track-artist').html(), trackEl.children('.track-title').html() );

			this.Controls.Play( track );

		},

		// Callback'd function - add the passed models to the current search results list
		addToSearchResults: function ( model ) {
			console.log( Player.Views );

			//var track = Player.Playlist.create({source: 'rdio', title: 'whatever', artist: 'whatever'});
			var view = new Player.Views.TrackView({ model: model });
			Player.$el.find('#search-results').append( view.render( 'search-result' ).el );
		},

		// Retrieve the track element from the cache if it exists
		// Search contains the current search cache and is keyed by a hash of artist + track title
		retrieveFromCache: function ( artist, title ) {
			return Player.Cache.Search[ _.hash( artist + title ) ];
		},

		setupCanvas: function () {

			var app = this;

			// Set up the canvas
			paper.setup( $('canvas.playlist')[0] );

			$('canvas.playlist').css({ width: '100%', height: '100%' });

			// Set up physics
			paper.physics = {
				options: {
					dragCoefficient: 0.95,
					gravity: { x: 0, y: -50 }, // Pixels per tick (PPT).  No, that's not a unit you'll see anywhere in actual physics
					collisions: true // This can still be overridden on a per-item basis
				},

				queue: []
			}

			// Begin frame updating and process frame events
		    paper.view.onFrame = function ( event ) {

		    	// Redraw the frame
		        paper.view.draw(); 

		  		// Process physics
		  		app.processPhysics( event );
		        	
		    } 	

    		// Set up extra functionality for paper Items

    		_.extend( paper.Item.prototype, {

    			acceleration: { x: 0, y: 0 },
    			velocity: { x: 0, y: 0 },
    			mass: 1, // Assuming mass is simply 1 for everybody for the moment, but may change later
    			physics: true, // Process physics for this Item
    			gravity: true, // Process gravity for this Item
    			collisions: true, // Can collide with other objects
    			dragging: false, // Physics will not be applied to an object being dragged
    			tool: new paper.Tool(), // Used to handle sticky mouseUp events

    			// Is this group within the view bounds?  Cause if not, we've got a problem, man
    			// returns which side impacted and by how much
    			outOfBounds: function ( point ) {

    				if ( ! ( ( point.x + ( this.bounds.width / 2 ) ) < paper.view.bounds.width ) )
    					return { side: 'right', inter: paper.view.bounds.width - ( point.x + ( this.bounds.width / 2 ) ) };

    				if ( ! ( ( point.y + ( this.bounds.height / 2 ) ) < paper.view.bounds.height ) )
    					return { side: 'bottom', inter: paper.view.bounds.height - ( point.y + ( this.bounds.height / 2 ) ) };

    				if ( ! ( ( point.x - ( this.bounds.width / 2 ) ) > 0 ) )
    					return { side: 'left', inter: -( point.x - ( this.bounds.width / 2 ) ) };

    				if ( ! ( ( point.y - ( this.bounds.height / 2 ) ) > 0 ) )
    					return { side: 'top', inter: -( point.y - ( this.bounds.height / 2 ) ) };

    				return false;
    			}

    		});

		},

		setupSpotify: function ( callback ) {

			$.getJSON( player.Config.spotify.auth_url, function ( response ) {
				if ( response.success ) callback();
				if ( response.error ) console.error( 'Could not authenticate with Spotify.' );
			});

		},

		// Set up audio player
		setupjPlayer: function () {

			$('.jplayer').jPlayer({
				ready: function ( event ) {
					player.Config.jplayer_ready = true;
					player.$jPlayer = $('.jplayer');
				},
				pause: function() {
					$(this).jPlayer("clearMedia");
				},
				error: function ( event ) {
					console.log( event.jPlayer.error );
				},
				play: function ( event ) {
					player.App.Controls.TurnOn();
				},
				swfPath: "/assets/js/vendor/jQuery.jPlayer.2.5.0",
				supplied: "mp3",
				preload: "none",
				wmode: "window",
				keyEnabled: true
			});

		},

		// Process the physics queue.  This includes item flicks, collisions and
		// gravity.  This makes certain useful assumptions - icons are square and
		// always have the same mass (subject to change)
		processPhysics: function ( event ) {

			var app = this;
			
			_.each( paper.physics.queue, function ( item ) {

				// First thing - update the velocity manually if dragging - this is here instead of the
				// drag event because we need to know if icon is at rest at the end of the drag
				if ( item.dragging ) {
					item.velocity = new paper.Point( item.position.x - item.lastPosition.x, item.position.y - item.lastPosition.y );
					item.lastPosition = item.position;					
				}				

				if ( ! item.dragging && item.physics ) { // These both override all physics effects

					// Check for collisions using simple n^2 detection - will improve if necessary
					// This essentially assumes squares/spheres, but the x/y properties could be used
					// to deal with rectangles if necessary later
					app.processCollisions( item );

					// Then update velocity from acceleration with simple drag
					item.velocity = {
						x: ( item.velocity.x + ( item.acceleration.x * event.delta ) ) * paper.physics.options.dragCoefficient,
						y: ( item.velocity.y + ( -item.acceleration.y * event.delta ) ) * paper.physics.options.dragCoefficient
					}

	        		// Ballpark this so it's not processing physics to infinitesimally small numbers
					if ( Math.abs( item.velocity.x ) > 0.1 || Math.abs( item.velocity.y ) > 0.1 ) {

		        		// Update the position based on the new velocity
		        		var newPosition = { 
		        			x: item.position.x + item.velocity.x,
		        			y: item.position.y + item.velocity.y
		        		}

		        		// Check if the new position will be out of bounds and reverse the velocity/impulse if so
		        		if ( item.outOfBounds( newPosition ) ) {
		        			// Capture what side it impacted on
		        			var side = item.outOfBounds( newPosition );

		        			// Resolve interpenetration before changing velocity
		        			if ( side.side == 'left' || side.side == 'right' )
		        				newPosition.x += side.inter;
		        			else
		        				newPosition.y += side.inter;

		        			// Reverse the object velocity depending on where it hit
		        			if ( side.side == 'left' || side.side == 'right' )  
		        				item.velocity.x *= -1;
		        			else
		        				item.velocity.y *= -1;
		        		}		        			

		        		// Update the object with the new position
		        		item.position = newPosition;

		        	} else

		        		item.velocity = { x: 0, y: 0 }; // Done processing, clear the object out
				}

			});

		},

		processCollisions: function ( item ) {

			var app = this;

			// Manual method, maaaaybe faaster...?
			/*_.each( paper.physics.queue, function ( other ) {
				if ( item != other && item.collisions && other.collisions && other.children['hitbox'] && item.children['hitbox'] ) {
					// Update hitbox positions based on offset
					// Note this isn't sq. rooted - waste of time for what we're doing
					var distance = ( ( ( item.position.x - item.children['hitbox'].offset.x ) - ( other.position.x - other.children['hitbox'].offset.x ) ) * 
						( ( item.position.x - item.children['hitbox'].offset.x ) - ( other.position.x - other.children['hitbox'].offset.x ) ) ) +
						( ( ( item.position.y - item.children['hitbox'].offset.y ) - ( other.position.y - other.children['hitbox'].offset.y ) ) * 
						( ( item.position.y - item.children['hitbox'].offset.y ) - ( other.position.y - other.children['hitbox'].offset.y ) ) );							

					// Also squared
					var size = ( item.children['hitbox'].bounds.width * item.children['hitbox'].bounds.width );

					var normal = new paper.Point( item.position.x - other.position.x, item.position.y - other.position.y );

					console.log( normal.getAngle() );

					// Check if a hit has occurred
					if ( distance < size ) {
						console.log( 'hit' );
					}
						
				}
			});*/

			// Paper methods
			_.each( paper.physics.queue, function ( other ) {
				if ( item != other && item.collisions && other.collisions && other.children['hitbox'] && item.children['hitbox'] ) {
					var here = new paper.Point( item.position.x - item.children['hitbox'].offset.x, item.position.y - item.children['hitbox'].offset.y );
					var there = new paper.Point( other.position.x - other.children['hitbox'].offset.x, other.position.y - other.children['hitbox'].offset.y );				

					// Check if a hit has occurred
					if ( here.isClose( there, item.children['hitbox'].bounds.width ) ) {
						// Get the collision normal and adjust the quadrant for left/top/right/bottom = 1,2,3,4
						var normal = new paper.Point( here.x - there.x, here.y - there.y );
						normal = normal.rotate( 45 );

						// Get what side the collision occurred on
						var side = normal.getQuadrant();

						// Get the distance between the points
						// Uses sqrt which is costly but necessary for resolving interpenetration
						var distance = here.getDistance( there, false );
						var inter = item.children['hitbox'].bounds.width - distance;

						// Resolve the collision based on the side
						switch ( side ) {
							case 1: // left
								var newItemPos = { x: item.position.x + ( inter / 2 ), y: item.position.y };
								var newOtherPos = { x: other.position.x - ( inter / 2 ), y: other.position.y };
							break;

							case 2: // top
								var newItemPos = { x: item.position.x, y: item.position.y + ( inter / 2 ) };
								var newOtherPos = { x: other.position.x, y: other.position.y - ( inter / 2 ) };
							break;

							case 3: // right
								var newItemPos = { x: item.position.x - ( inter / 2 ), y: item.position.y };
								var newOtherPos = { x: other.position.x + ( inter / 2 ), y: other.position.y };
							break;

							case 4: // bottom
								var newItemPos = { x: item.position.x, y: item.position.y - ( inter / 2 ) };
								var newOtherPos = { x: other.position.x, y: other.position.y + ( inter / 2 ) };
							break;
						}

						// Set the new position if it's not out of bounds
						if ( ! item.outOfBounds( newItemPos ) )
							item.position = newItemPos;
						if ( ! other.outOfBounds( newOtherPos ) )
							other.position = newOtherPos;

						// Then figure out the new velocity.  This simplifies down to essentially 1
						// dimension if we only worry about velocity in the direction of contact
						if ( side == 1 || side == 3 ) {
							var newVelocities = app.processVelocity( item.mass, other.mass, item.velocity.x, other.velocity.x );

							item.velocity = { x: newVelocities.v1f, y: item.velocity.y };
							other.velocity = { x: newVelocities.v2f, y: other.velocity.y };
						} else {
							var newVelocities = app.processVelocity( item.mass, other.mass, item.velocity.y, other.velocity.y );

							item.velocity = { x: item.velocity.x, y: newVelocities.v1f };
							other.velocity = { x: other.velocity.x, y: newVelocities.v2f };
						}						
						
					}
					
				}
				
			});

		},

		// Solve velocity for simply 1D elastic collections
		// Generally only one item will be moving but this will still account for
		// both objects have initial velocity
		processVelocity: function ( m1, m2, v1i, v2i ) {

			var velocities = {};

			velocities.v1f = ( v1i * ( m1 - m2 ) + ( 2 * m2 * v2i ) ) / ( m1 + m2 );
			velocities.v2f = velocities.v1f - v2i + v1i;

			return velocities;

		}

	});	

	// Start the music (literally! Hurray!)
	player.App = new player.Views.App; // Define the global player object

	return player;

})( Player || { Models: {}, Views: {}, Collections: {}, Cache: {} } );
