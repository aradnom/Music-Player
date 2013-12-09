// Global app config info

var Player = ( function ( player ) {

	player.Config = {
		spotify: {
			lookup_api_url: 'http://ws.spotify.com/lookup/1/',
			search_api_url: 'http://ws.spotify.com/search/1/',
			auth_url: '/api/spotify/auth',
			stream_url: '/api/spotify/stream/'
		},

		// Keep track of which services are currently active for streaming
		streaming: {},

		// Services to search - populated by service models at run
		searchAPIs: [],

		// Service currently playing
		playing: null,

		// Keep track of jPlayer's status
		jplayer_ready: false,

		// Make sure we're not searching too fast
		searchTimer: false
	};

	return player;

})( Player || { Models: {}, Views: {}, Collections: {}, Cache: {} } );