
$( function () {

	var PlaylistCollection = Backbone.Collection.extend({

		model: Backbone.Track

	});

	Backbone.Playlist = new PlaylistCollection;

});