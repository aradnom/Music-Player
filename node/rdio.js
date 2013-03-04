// Necessary requires
var express = require( 'express' );


rdio.get( '/', function ( req, res ) {
	var body = 'Boo!';
	res.setHeader( 'Content-Type', 'text/plain' );
	res.setHeader( 'Content-Length', body.length );
	res.end( body );
});

rdio.listen( 7346 );
console.log( 'Listening on port 7346...' );
