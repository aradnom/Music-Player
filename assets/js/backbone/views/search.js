// View in charge of controlling search functionality

var Player = ( function ( player ) {

	player.Views.Search = Backbone.View.extend({

		el : $('.menu__search'),

		// Playlist element events
		events : {
			'keyup .menu__search__query' 	: 'RunSearch',
			'focus .menu__search__query' 	: 'SearchFocusIn',
			'blur .menu__search__query'		: 'SearchFocusOut'
		},

		RunSearch: function ( event ) {
			var input = $(event.currentTarget);

			if ( input.val().length > 2 ) {
				$('.menu__search__keep-typing').fadeOut( 200, function () { $(this).hide(); } );

				// Start a timer on keyup
				if ( player.Config.searchTimer ) clearTimeout( player.Config.searchTimer );

				// Only run search if no keys have been pressed in the last half second
				// 2nd arg is a callback function to run on successful search response
				player.Config.searchTimer = setTimeout( function () {
					// Put in search requests on models available
					$.each( player.Config.searchAPIs, function () {
						this.search({ types: 'track', query: input.val() });
					});
				}, 500 );
			} else {
				$('.menu__search__keep-typing').fadeIn( 200 );
			}
		},

		SearchFocusIn: function ( event ) {
			$(event.currentTarget).parent().addClass( 'focus' );
		},

		SearchFocusOut: function ( event ) {
			$(event.currentTarget).parent().removeClass( 'focus' );
			$('.menu__search__keep-typing').fadeOut( 200, function () { $(this).hide(); } );
		},

		PushSearchResults: function ( results ) {
			if ( results.length ) {
				// Push results to the search results collection
				player.SearchResults.add( results );
			}
		}

	});

	// Create the initial playlist
	player.Search = new player.Views.Search; 

	return player;

})( Player || { Models: {}, Views: {}, Collections: {}, Cache: {} } );
