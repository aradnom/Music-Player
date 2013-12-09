// Track model - contains everything related to a single track
// This means title, artist, album and most importantly, where
// it comes from - the stream source.
// This is a generic container.  Info from Track can be added
// both to a standard list playlist as well as to the playlist
// canvas via the playlist view.

var Player = ( function ( player ) {

	// Save model to the Player namespace for use later
	player.Models.Track = Backbone.Model.extend({

		defaults: {
			source: null,
			title: null, 
			artist: null,
			album: null,
			icon: null,
			relevance: null,
			rdioKey: null, // Rdio's play key
			spotifyKey: null, // Spotify's play href
		},

		initialize: function ( atts, options ) {
			this.defaults.source = atts.source;
			this.defaults.title = atts.title;
			this.defaults.artist = atts.artist;
			this.defaults.album = atts.album;
			this.defaults.icon = atts.icon;
			this.defaults.relevance = atts.relevance;
			this.defaults.rdioKey = atts.rdioKey;
			this.defaults.spotifyKey = atts.spotifyKey;
		}

	});

	return player;

})( Player || { Models: {}, Views: {}, Collections: {}, Cache: {} } );