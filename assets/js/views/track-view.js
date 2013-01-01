
$( function () {

	var TrackView = Backbone.View.extend({

		tagName: 'div',

		className: 'track',

		// Template function
		template: _.template( $('#song-template').html() ),

		initialize: function () {
			this.listenTo( this.model, "change", this.render );
		},

		render: function () {
			this.$el.html( template( this.model.toJSON() ) );
		}
		
	});

});
