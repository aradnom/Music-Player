// Track model - contains everything related to a single track
// This means title, artist, album and most importantly, where
// it comes from - the stream source.

$( function () {	

	var Album = Backbone.Model.extend({

		// Tie this model into the local search cache
		windowStore : new Backbone.windowStore( 'search-album' ),

		defaults : {
			source: null,
			title: null, 
			artist: null,
			album: null,
			icon: null,
			rdioKey: null // Rdio's play key
		},

		initialize : function ( atts ) {
			this.defaults.source = atts.source;
			this.defaults.title = atts.title;
			this.defaults.artist = atts.artist;
			this.defaults.album = atts.album;
			this.defaults.icon = atts.icon;
			this.defaults.rdioKey = atts.rdioKey;
		}

	});

	// Add the Album model to Backbone itself so other models can reference it
	Backbone.Album = Album;

});