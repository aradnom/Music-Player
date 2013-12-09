var lame = require('lame');
var Speaker = require('speaker');
var Spotify = require('spotify-web');
var config = require('config').config;
var uri = process.argv[2] || 'spotify:track:6tdp8sdXrXlPV6AZZN2PE8';

// Spotify credentials...
var username = process.env.USERNAME;
var password = process.env.PASSWORD;

var decoder = new lame.Decoder;

Spotify.login(username, password, function (err, spotify) {
	if (err) throw err;

	// first get a "Track" instance from the track URI
	spotify.get(uri, function (err, track) {
		if (err) throw err;
		console.log('Playing: %s - %s', track.artist[0].name, track.name);

		// play() returns a readable stream of MP3 audio data
		track.play()
			.pipe(new lame.Decoder())
			.pipe(new Speaker())
			.on('finish', function () {
				spotify.disconnect();
			});

	})
});