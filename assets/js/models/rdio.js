// Rdio API model - this controls all Rdio API interaction (methods as well as stream control)
// Requires: Backbone - Song

$( function () {

	var R = Backbone.Model.extend({

		play : function ( identifier ) {
			$('#api-rdio').rdio().play( identifier );
		}

	});

});