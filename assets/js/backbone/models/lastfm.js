// Rdio API model - this controls all Rdio API interaction (methods as well as stream control)
// Requires: Backbone - Song

$( function () {

	var Lastfm = Backbone.Model.extend({

		// Tie this model into the local search cache
		windowStore : new Backbone.windowStore( 'lastfm' ),

		defaults : {
			api_key: false,
			api_root: false
		},

		initialize : function () {

			// Keep track of Backbone this context
			var _this = this;

			// Get the last.fm API key before proceeding
			$.post( '/admin_api/get_api_key', { api : 'lastfm' }, function ( response ) {
				var parsed = $.parseJSON( response );

				if ( parsed && parsed.api_key )
					_this.defaults.api_key = parsed.api_key;
			});

			// And the API root
			$.post( '/admin_api/get_api_root', { api : 'lastfm' }, function ( response ) {
				var parsed = $.parseJSON( response );

				if ( parsed && parsed.api_root )
					_this.defaults.api_root = parsed.api_root;
			});

		},

		// Args:
		// query - the query to be used with the below
		// types - one or more of (comma-separated): album, artist, track
		// limit (opt.) - int
		// page (result offset, opt) - int
		search : function ( args ) {

			if ( this.defaults.api_key && this.defaults.api_root ) {
				// Make sure everything's cool
				if ( ! args.types || ! args.query )
					return false;

				// LastFM splits its search into separate methods, so process each one
				// Note that this means results will report in at different times
				var types = args.types.split( ',' );

				// Create query object from valid filtered attributes in args
				var params = _.pick( args, 'limit', 'page' );

				if ( _.indexOf( types, 'album' ) != -1 )
					this.sendQuery( _.extend({ method: 'album.search', album: args.query }, params ) );

				if ( _.indexOf( types, 'artist' ) != -1 )
					this.sendQuery( _.extend({ method: 'artist.search', artist: args.query }, params ) );

				if ( _.indexOf( types, 'track' ) != -1 )
					this.sendQuery( _.extend({ method: 'track.search', track: args.query }, params ) );

			}

		},

		sendQuery: function ( args ) {

			var _this = this; // Retain reference to the model scope

			$.get( this.defaults.api_root, _.extend( args, { api_key: this.defaults.api_key, format: 'json' } ), 
				function ( response ) {
					if ( response.results['opensearch:totalResults'] > 0 ) {
						console.log( response );
						switch ( args.method ) {
							case 'album.search': _this.sync( 'album', response.results.albummatches.album ); break;
							case 'artist.search': _this.sync( 'artist', response.results.artistmatches.artist ); break;
							case 'track.search': _this.sync( 'track', response.results.trackmatches.track ); break;
						}
					}						
			});

		},

		sync: function ( type, results ) {

			switch ( type ) {
				case 'album':

				break;

				case 'artist':

				break;

				case 'track':

					$.each( results, function () {
						var track = new Player.Models.Track({
							source: 'lastfm',
							title: this.name,
							artist: this.artist,
							album: null, // Lastfm doesn't return the album name with the track
							icon: this.image[1]['#text'] // The image array contains sizes 1-4 - 1 is medium
						});

						// Cache the track
						track.save();						
					});
					
				break;
			}

		}

	});

	// Extend the last.fm API into jQuery
	Player.lastfm = new Lastfm;

});