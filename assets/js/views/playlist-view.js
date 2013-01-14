// View in charge of controlling playlist functionality.
// This is the playlist listing, which is separate (but should mirror)
// the canvas playlist

$( function () {

	Player.Views.PlaylistView = Backbone.View.extend({

		el : $('#playlist-list'),

		// Playlist element events
		events : {
			"click #add"	: "addTrack",
		},

		addTrack : function () {
			Backbone.Playlist.create({source: 'rdio', title: 'whatever', artist: 'whatever'});
		},

		addToPlaylist : function ( track ) {
			var track = Player.Playlist.create({source: 'rdio', title: 'whatever', artist: 'whatever'});
			var view = new Player.Views.TrackView({ model: track });
			this.$el.append( view.render().el );
		}

	});

	// Create the initial playlist
	Player.PlaylistView = new Player.Views.PlaylistView; 

});


