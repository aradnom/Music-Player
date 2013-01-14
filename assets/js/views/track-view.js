
$( function () {

	// Save this view for use later
	Player.Views.TrackView = Backbone.View.extend({

		tagName: 'div',

		className: 'track',

		// Template function
		trackTemplate: _.template( $('#track-template').html() ),

		searchTemplate: _.template( $('#search-result-template').html() ),

		initialize: function ( options ) {
			this.listenTo( this.model, "create", this.render );

			if ( options.type && options.type == 'cache' )
				this.$el.attr( 'cache-id', _.hash( this.model.attributes.artist + this.model.attributes.title ) );
		},

		render: function ( type ) {
			switch ( type ) {
				case 'track': this.$el.html( this.trackTemplate( this.model.toJSON() ) ); break;
				case 'search-result': this.$el.html( this.searchTemplate( this.model.toJSON() ) ); break;
			}			

			// Back to the studio
			return this;
		}
		
	});

});
