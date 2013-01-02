// Where the magic happens

$( function () {

	var App = Backbone.View.extend({
		
		el: $('body'),

		initialize: function () {

		}

	});	

	// Start the music (literally!)

	Backbone.app = new App;

});

