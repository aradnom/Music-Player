// Spotify API model - this controls all Rdio API interaction (methods as well as stream control)
// Requires: Backbone - Song

$( function () {

	var Spotify = Backbone.Model.extend({

		// Tie this model into the local search cache
		windowStore : new Backbone.windowStore( 'spotify' ),

		defaults : {
			api_root: false
		},

		initialize : function () {

			// Keep track of Backbone this context
			var _this = this;

			// And the API root
			$.post( '/admin_api/get_api_root', { api : 'spotify' }, function ( response ) {
				var parsed = $.parseJSON( response );

				if ( parsed && parsed.api_root )
					_this.defaults.api_root = parsed.api_root;
			});

		},

		// Args:
		// query - the query to be used with the below
		// types - one or more of (comma-separated): album, artist, track
		// page (result offset, opt) - int
		search : function ( args ) {

			if ( this.defaults.api_root ) {
				// Make sure everything's cool
				if ( ! args.types || ! args.query )
					return false;

				// Spotify splits its search into separate methods, so process each one
				// Note that this means results will report in at different times for this API
				var types = args.types.split( ',' );

				// Create query object from valid filtered attributes in args
				var params = _.pick( args, 'page' );

				if ( _.indexOf( types, 'album' ) != -1 )
					this.sendQuery( 'album.json', _.extend( { q: args.query }, params ));

				if ( _.indexOf( types, 'artist' ) != -1 )
					this.sendQuery( 'artist.json', _.extend( { q: args.query }, params ));

				if ( _.indexOf( types, 'track' ) != -1 )
					this.sendQuery( 'track.json', _.extend( { q: args.query }, params ));

			}

		},

		sendQuery : function ( suffix, args ) {

			var _this = this; // Retain reference to the model scope
			
			$.get( this.defaults.api_root + suffix, args, function ( response ) {				

				// For each of the results, create a Track and cache the results
				if ( response.info.num_results ) {
					console.log( response );
					switch ( suffix ) {
						case 'album.json': _this.sync( 'album', response.albums ); break;
						case 'artist.json': _this.sync( 'artist', response.artists ); break;
						case 'track.json': _this.sync( 'track', response.tracks ); break;
					}
				}				

			});

		},

		sync : function ( type, results ) {
			switch ( type ) {
				case 'album':

				break;

				case 'artist':

				break;

				case 'track':

					$.each( results, function () {
						var track = new Player.Models.Track({
							source: 'spotify',
							title: this.name,
							// Spotify returns multiple artists in array, so map those out and join 
							artist: _.map( this.artists, function ( v ) { return v.name; } ).join( ', ' ),
							album: this.album.name,
							icon: null, // Spotify track search doesn't return an album icon
							spotifyKey: this.href
						});

						// Cache the track
						track.save();						
					});
					
				break;
			}
		}

	});

	// Extend the last.fm API into jQuery
	Player.spotify = new Spotify;

});
