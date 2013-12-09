// Artist model - this is linked to a track and can be used to return
// artist information from API sources 

var Player = ( function ( player ) {	

	// Save model to Player namespace
	player.Models.Artist = Backbone.Model.extend({
		
	});

	return player;

})( Player || { Models: {}, Views: {}, Collections: {}, Cache: {} } );