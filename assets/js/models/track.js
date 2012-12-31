// Track model - contains everything related to a single track
// This means title, artist, album and most importantly, where
// it comes from - the stream source.

$( function () {

	

	var Track = Backbone.Model.extend({

		// Tie this model into the local search cache
		windowStore : new Backbone.windowStore( 'search' ),

		defaults : {
			source: null,
			title: null, 
			artist: null,
			icon: null
		},

		initialize : function ( atts ) {
			this.defaults.source = atts.source;
			this.defaults.title = atts.title;
			this.defaults.artist = atts.artist;
			this.defaults.icon = atts.icon;
		}
		
	});

});