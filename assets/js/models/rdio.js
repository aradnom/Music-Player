// Rdio API model - this controls all Rdio API interaction (methods as well as stream control)
// Requires: Backbone - Song

$( function () {

	var Rdio = Backbone.Model.extend({

		// Tie this model into the local search cache
		windowStore : new Backbone.windowStore( 'rdio' ),

		defaults : {
			api_root: false
		},

		initialize : function () {

			// Nothing to do here			

		},

		// Args:
		// query - the query to be used with the below
		// types - one or more of (comma-separated): album, artist, track
		// page (result offset, opt) - int
		// limit (int, opt.)
		search : function ( args, callback ) {
			// Make sure everything's cool
			if ( typeof( args ) == 'undefined' || ! args.types || ! args.query )
				return false;

			// Create query object from valid filtered attributes in args
			var params = _.pick( args, 'page', 'limit' );

			// Convert vars to what rdio likes
			var final_params = {};

			if ( params.limit )
				final_params.count = params.limit;

			if ( params.page )
				final_params.start = params.page * params.limit;

			this.sendQuery( _.extend( args, final_params ), callback );

		},

		sendQuery : function ( args, callback ) {

			var _this = this; // Retain reference to the model scope

			$.post( '/rdio_api/search', args, function ( response ) { 
				var parsed = $.parseJSON( response );

				// Make sure the request was successful and cache the results if so
				if ( parsed && parsed.status == 'ok' && parsed.result.number_results > 0 ) {
					_this.sync( parsed.result.results, callback );
					console.log( parsed.result );
				}
				 
			});			
	
		},

		// Sync results to local window cache.  Rdio just returns all results (artist, album and track)
		// as one lump result array, so the type of each result has to be checked before creating the
		// Artist, Track and Album models
		sync : function ( results, callback ) {

			$.each( results, function () {

				switch ( this.type ) {
					case 'a': // Album

					break;

					case 'r': // aRtist

					break;

					case 't': // Track

						var track = new Player.Models.Track({
							source: 'rdio',
							title: this.name,
							artist: this.artist,
							album: this.album,
							icon: this.icon,
							rdioKey: this.key
						});

						// Cache the track locally
						track.save();

						// Add the track to the current search results
						callback( track );
					break;
				}
										
			});
			
		}

	});

	// Put the rdio object into the player parent object
	Player.rdio = new Rdio;

});
