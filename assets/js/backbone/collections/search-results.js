
var Player = ( function ( player ) {

	player.Collections.SearchResults = Backbone.Collection.extend({

		model : Player.Models.Track,

		initialize : function () { 
			
			// Bind playlist events
			this.on( 'add', function ( track ) {
				this.AddToSearchResults( track );		
			});

		},

		// Add to search results.
		AddToSearchResults : function ( track ) {
			var view = new player.Views.Track({
				template: player.Templates.search_results_template,
				className: 'result',
				model: track
			});

			$('.menu__search__results').append( view.el );
		}

	});

	player.SearchResults = new player.Collections.SearchResults;

	return player;

})( Player || { Models: {}, Views: {}, Collections: {}, Cache: {} } );