// View in charge of controlling playlist functionality.

$( function () {

	var PlaylistView = Backbone.View.extend({

		id : 'playlist-list',

		events : {
			"click #add"	: "addTrack"
		},

		addTrack : function () {
			Backbone.Playlist.create({source: 'rdio', title: 'whatever', artist: 'whatever'});
			console.log( 'added' );
		}

	});

	// Create the initial playlist
	Backbone.PlaylistView = new PlaylistView({el: '#playlist-list'}); 

});


