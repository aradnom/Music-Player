var lame = require( 'lame' ),
	Spotify = require( 'spotify-web' ),
	express = require( 'express' ),
	config = require( 'config' ).config;

// Set up express
var api = express();

// Empty spotify object filled after auth
var spotify = null;

// Bump listeners up
process.setMaxListeners( 0 );

api.get( '/api/spotify/auth', function ( req, res ) {
	spotifyAuth( function ( session ) {
		if ( ! session ) throw new Error( 'Could not create Spotify session.' );

		spotify = session;

		console.log( 'Spotify session created.' );

		res.jsonp( { success: true, message: 'Spotify session created.' } );
	});
});

// API routes
api.get( '/api/spotify/stream/:track', function ( req, res ) {
	var track = req.params.track;

	if ( spotify && track ) {
		res.setHeader( "Content-Type", "audio/mpeg" );
		spotifyStream( track, res );
	} else {
		res.jsonp( { error: 'Spotify session not set.  Please authenticate first.' } );
	}

});

// And start the API
api.listen( config.port );

console.log( 'Data API is active on port ' + config.port );

/////////////////////////////////////////////////////////////
// Functions ////////////////////////////////////////////////
/////////////////////////////////////////////////////////////

process.on( 'SIGINT', function() {
	console.log( "\nShutting down by interrupt..." );

	if ( spotify ) spotify.disconnect();

	process.exit( 0 );
});

/////////////////////////////////////////////////////////////
// Functions ////////////////////////////////////////////////
/////////////////////////////////////////////////////////////

// Login with credentials in config and create new Spotify session
// Must be done before streaming
function spotifyAuth ( callback ) {
	// If session already exists just kick it back
	if ( spotify ) {
		callback( spotify );
	} else {
		// Otherwise run new login
		Spotify.login( config.spotify.username, config.spotify.password, function ( err, spotify ) {
			if ( err ) throw err;

			callback( spotify );	
		});
	}	
}

// Stream through spotify session (created above) and pipe stream to passed
// express response object
function spotifyStream ( track, res ) {
	if ( ! spotify ) throw new Error( 'Spotify session does not exist.  Please authenticate.' );

	// first get a "Track" instance from the track URI
	spotify.get( track, function ( err, streamTrack ) {
		if (err) throw err;
		console.log( 'Playing: %s - %s', streamTrack.artist[0].name, streamTrack.name );

		// play() returns a readable stream of MP3 audio data
		var play = streamTrack.play();

		play.pipe( res );

		// Disconnect on finish
		/*play.on( 'finish', function () {
			spotify.disconnect();
		});*/
	});
}