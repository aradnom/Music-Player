// Spotify API model - this controls all Rdio API interaction (methods as well as stream control)
// Requires: Backbone - Song

var Player = ( function ( player ) {

	player.Models.Spotify = Backbone.Model.extend({

		initialize : function () { 
			// Load the new model into the array of valid search APIs
			player.Config.searchAPIs.push( this ); 
		},

		// Args:
		// query - the query to be used with the below
		// types - one or more of (comma-separated): album, artist, track
		// page (result offset, opt) - int
		search : function ( args ) {

			// Make sure everything's cool
			if ( ! args.types || ! args.query ) return false;

			// Spotify splits its search into separate methods, so process each one
			// Note that this means results will report in at different times for this API
			var types = args.types.split( ',' );

			// Create query object from valid filtered attributes in args
			var params = _.pick( args, 'page' );

			if ( _.indexOf( types, 'album' ) != -1 ) this.sendQuery( 'album.json', _.extend( { q: args.query }, params ));				

			if ( _.indexOf( types, 'artist' ) != -1 ) this.sendQuery( 'artist.json', _.extend( { q: args.query }, params ));				

			if ( _.indexOf( types, 'track' ) != -1 ) this.sendQuery( 'track.json', _.extend( { q: args.query }, params ));

		},

		sendQuery : function ( suffix, args ) {

			var _this = this; // Retain reference to the model scope
			
			$.get( player.Config.spotify.search_api_url + suffix, args, function ( response ) {				

				// For each of the results, create a Track and cache the results
				if ( response.info.num_results ) {
					console.log( response );
					switch ( suffix ) {
						case 'album.json': _this.BuildSearchResults( 'album', response.albums ); break;
						case 'artist.json': _this.BuildSearchResults( 'artist', response.artists ); break;
						case 'track.json': _this.BuildSearchResults( 'track', response.tracks ); break;
					}
				}				

			});

		},

		BuildSearchResults : function ( type, results ) {
			switch ( type ) {
				case 'album':

				break;

				case 'artist':

				break;

				case 'track':

					// Create new Tracks from results
					var tracks = [];

					$.each( results, function ( index ) {
						// Only push the first 20 results.  No, Spotify's API does not have a count
						// or limit arg. ¯\_(ツ)_/¯
						if ( index < 20 ) {
							tracks.push( new Player.Models.Track({
								source: 'spotify',
								title: this.name,
								// Spotify returns multiple artists in array, so map those out and join 
								artist: _.map( this.artists, function ( v ) { return v.name; } ).join( ', ' ),
								album: this.album.name,
								icon: null, // Spotify track search doesn't return an album icon, BOOOOOO
								relevance: parseFloat( this.popularity ),
								spotifyKey: this.href
							}));
						}
					});

					// Push the resulting tracks to the search results
					player.Search.PushSearchResults( tracks );
					
				break;
			}
		},

		PlayTrack: function ( track ) {
			if ( player.Config.streaming.spotify && player.Config.jplayer_ready ) {
				var track = player.__.jPlayerStream( 'Spotify Stream', player.Config.spotify.stream_url + track );

				player.$jPlayer.jPlayer( 'setMedia', track );
				player.$jPlayer.jPlayer( 'play' );

				player.Config.playing = 'spotify';
			}
		}

	});

	Player.Spotify = new player.Models.Spotify;

	return player;

})( Player || { Models: {}, Views: {}, Collections: {}, Cache: {} } );
