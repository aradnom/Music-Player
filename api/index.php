<?php
require_once( 'inc/oauth.php' );
require_once( 'inc/api.rdio.php' );

session_start();

// Authenticate Rdio API if necessary

$rdio_key = 'kumkmfms5yav7jk29frc37dz';
$rdio_secret = 'KQyjQpbea6';

//$rdio_api = new RdioAPI();
//$rdio_api->request_token( $rdio_key, $rdio_secret, 'http://localhost/musicplayer/api' );

print_r( $_SESSION );

?>
<html>
<head>
    <title>Woo!</title>
    <script type="text/javascript" src="js/jquery-1.8.2.min.js"></script>
    <script type="text/javascript" src="js/jquery.rdio.min.js"></script>
    <script type="text/javascript" src="js/jquery.oauth.js"></script>    
</head>
<body>

<div id="rdio-api"></div>

<p>Stuff</p>

</body>
</html>