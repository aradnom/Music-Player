// App internal (utility) functions

var Player = ( function ( player ) {

	player.__ = {
		jPlayerStream: function ( title, url ) {
			if ( ! url ) return false;

			return {
				title: title || 'A Stream',
				mp3: url
			};
		},

		hash: function ( string ) {
			var hash = 5381;

			_.each( string, function ( char ) {
				hash = ( ( hash << 5 ) + hash ) + char.charCodeAt(0);
			});

			return hash;
		}
	};

	return player;

})( Player || { Models: {}, Views: {}, Collections: {}, Cache: {} } );