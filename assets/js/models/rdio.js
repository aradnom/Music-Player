// Rdio API model - this controls all Rdio API interaction (methods as well as stream control)
// Requires: Backbone - Song

$( function () {

	var Rdio = Backbone.Model.extend({

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
		search : function ( args ) {
			
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

			this.sendQuery( _.extend( args, final_params ) );

		},

		sendQuery : function ( args ) {

			$.post( '/rdio_api/search', args, function ( response ) { console.log( response ) } );			
	
		}

	});

	// Extend the last.fm API into jQuery
	$.rdio = new Rdio;

});
