// Where the magic happens

$( function () {

	var App = Backbone.View.extend({
		
		el: $('body'),

		attributes: {
			activePlayer: null,
			dragCoefficient: 0.9
		},

		initialize: function () {

			// Starting variables
			this.searchTimer = false;

			// Initialize the canvas playlist
			this.setupCanvas();		

		},

		events : {
			'keyup #search' : 'search',
			'click #search-results .play' : 'playFromSearch',
			'click #search-results .add-to-playlist' : 'addTrackToPlaylist',
			'click #controls #stop' : 'stop'
		},

		// Standard controls - can be used from anywhere in the app and handle logic
		// such as figuring out a play source. These are just aliases of the below
		// for convenience
		Controls : {

			Play : function ( track ) {
				Player.play( track );
			},

			Stop : function () {
				Player.stop();				
			},

			Next : function () {
				Player.next();
			},

			Previous : function () {
				Player.previous();
			}

		},

		play : function ( track ) {
			if ( track ) {
				// Attempt to play the track if it has a playable source
				if ( track.attributes.source == 'rdio' ) {
					$('#api-rdio').rdio().play( track.attributes.rdioKey );
					this.attributes.activePlayer = 'rdio';
				}					
			}
		},

		stop : function () {
			switch ( this.attributes.activePlayer ) {
				case 'rdio': $('#api-rdio').rdio().stop(); break;
			}				
		},

		next : function () {

		},

		previous : function () {

		},

		search : function () {
			var _this = this;

			if ( $('#search').val().length > 2 ) {
				
				// Start a timer on keyup
				if ( this.searchTimer )
					clearTimeout( this.searchTimer );

				// Only run search if no keys have been pressed in the last half second
				// 2nd arg is a callback function to run on successful search response
				this.searchTimer = setTimeout( function () {
					Player.rdio.search({ query: $('#search').val(), types: 'track' }, _this.addToSearchResults );
					//Player.spotify.search({ query: $('#search').val(), types: 'track' }, this.addToSearchResults );
					//Player.lastfm.search({ query: $('#search').val(), types: 'track' }, this.addToSearchResults );
				}, 500 );
					
			}			
		},

		addTrackToPlaylist : function ( event ) {

			var trackEl = $(event.currentTarget).parents('.track');			
			track = this.retrieveFromCache( trackEl.children('.track-artist').html(), trackEl.children('.track-title').html() );

			if ( track )
				Player.Playlist.create( track.attributes );

		},

		playFromSearch : function ( event ) {

			var trackEl = $(event.currentTarget).parents('.track');			
			track = this.retrieveFromCache( trackEl.children('.track-artist').html(), trackEl.children('.track-title').html() );

			this.Controls.Play( track );

		},

		// Callback'd function - add the passed models to the current search results list
		addToSearchResults : function ( model ) {
			console.log( Player.Views );

			//var track = Player.Playlist.create({source: 'rdio', title: 'whatever', artist: 'whatever'});
			var view = new Player.Views.TrackView({ model: model });
			Player.$el.find('#search-results').append( view.render( 'search-result' ).el );
		},

		// Retrieve the track element from the cache if it exists
		// Search contains the current search cache and is keyed by a hash of artist + track title
		retrieveFromCache : function ( artist, title ) {
			return Player.Cache.Search[ _.hash( artist + title ) ];
		},

		setupCanvas : function () {

			var app = this;

			// Set up the canvas
			paper.setup( $('#playlist')[0] );

			// Begin frame updating and process frame events
		    paper.view.onFrame = function ( event ) {
		        paper.view.draw();

		        // Look for an active physics object and deal with it if it exists
		        // This is very basic physics for one object at a time, will extend if it appears necessary
		        if ( paper.view.physicsObject ) {
		        	if ( Math.abs( paper.view.physicsObject.velocity.x ) > 0.1 || Math.abs( paper.view.physicsObject.velocity.y ) > 0.1 ) {
		        		// Update the velocity
		        		paper.view.physicsObject.velocity.x *= app.attributes.dragCoefficient;
		        		paper.view.physicsObject.velocity.y *= app.attributes.dragCoefficient;

		        		// Update the position based on the new velocity
		        		var newPosition = { 
		        			x: paper.view.physicsObject.position.x + paper.view.physicsObject.velocity.x,
		        			y: paper.view.physicsObject.position.y + paper.view.physicsObject.velocity.y
		        		}

		        		// Check if the new position will be out of bounds and reverse the velocity/impulse if so
		        		if ( ! paper.view.physicsObject.withinBounds( newPosition ) ) {
		        			// Reverse the object velocity.  
		        			paper.view.physicsObject.velocity.x *= -1;
		        			paper.view.physicsObject.velocity.y *= -1;

		        			// If this is used instead of the above the object will appear to 
		        			// "thunk" against the bounds instead, which is kind of cute, I dunno /shrug
		        			/*newPosition = {
		        				x: paper.view.physicsObject.position.x - paper.view.physicsObject.velocity.x,
		        				y: paper.view.physicsObject.position.y - paper.view.physicsObject.velocity.y
		        			}*/
		        		}		        			

		        		// Update the object with the new position
		        		paper.view.physicsObject.position = newPosition;

		        	} else

		        		paper.view.physicsObject = null; // Done processing, clear the object out

		        }
		        	
		    } 	

    		// Set up extra functionality
    		
    		_.extend( paper.Group.prototype, {

    			velocity: 0,

    			tool: new paper.Tool(), // Used to handle sticky mouseUp events

    			// Is this group within the view bounds?  Cause if not, we've got a problem, man
    			withinBounds : function ( point ) {

    				if ( ( point.x + ( this.bounds.width / 2 ) ) < paper.view.bounds.width &&
    					 ( point.y + ( this.bounds.height / 2 ) ) < paper.view.bounds.height &&
    					 ( point.x - ( this.bounds.width / 2 ) ) > 0 &&
    					 ( point.y - ( this.bounds.height / 2 ) ) > 0 )
    					return true;
    				else
    					return false;
    			}

    		});    			

		}

	});	

	// Start the music (literally! Hurray!)

	Player = new App; // Define the global player object

	// Define area for saving Backbone objects
	Player.Views = {}; // Namespace to save views
	Player.Models = {}; // Namespace to save models
	Player.Collections = {}; // Namespace to save collections

	// Area for caching
	Player.Cache = {};

});

