// Track model - contains everything related to a single track
// This means title, artist, album and most importantly, where
// it comes from - the stream source.

var Player = ( function ( player ) {

	// Save model to the Player namespace for use later
	player.Models.Album = Backbone.Model.extend({

		defaults: {
			source: null,
			title: null, 
			artist: null,
			album: null,
			icon: null,
			rdioKey: null // Rdio's play key
		},

		initialize: function ( atts ) {
			this.defaults.source = atts.source;
			this.defaults.title = atts.title;
			this.defaults.artist = atts.artist;
			this.defaults.album = atts.album;
			this.defaults.icon = atts.icon;
			this.defaults.rdioKey = atts.rdioKey;
		}

	});

	return player;

})( Player || { Models: {}, Views: {}, Collections: {}, Cache: {} } );