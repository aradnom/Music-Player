
var Player = ( function ( player ) {

	// Save this view for use later
	player.Views.Track = Backbone.View.extend({

		tagName: 'div',

		className: 'track',

		defaults: {
			template: null
		},

		events: {
			'click .result__content': 'ActivateTrack'
		},

		initialize: function ( options ) {
			_.extend( this.defaults, options );

			// Render immediately
			this.render();
		},

		render: function ( type ) {
			this.$el.html( _.template( this.defaults.template, this.model.toJSON() ) );			

			// Back to the studio
			return this;
		},

		ActivateTrack: function ( event ) {
			var track = this.model.attributes.spotifyKey,
				artist = this.model.attributes.artist,
				title = this.model.attributes.title;

			// Request to play track through app with Spotify
			player.App.PlayTrack( track, artist, title, 'spotify' );

			// Add to the canvas
			player.Playlist.add( this.model );

			// NO BUBBLES
			return false;
		}
		
	});

	return player;

})( Player || { Models: {}, Views: {}, Collections: {}, Cache: {} } );
