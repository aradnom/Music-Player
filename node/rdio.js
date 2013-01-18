var express = require( 'express' );
var rdio = express();

rdio.get( '/', function ( req, res ) {
	var body = 'Boo!';
	res.setHeader( 'Content-Type', 'text/plain' );
	res.setHeader( 'Content-Length', body.length );
	res.end( body );
});

rdio.listen( 5555 );
console.log( 'Listening on port 5555...' );
