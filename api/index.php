<?php
session_start();

$key = 'kumkmfms5yav7jk29frc37dz';
$secret = 'KQyjQpbea6';

// Request token
$oauth = new OAuth( $key, $secret );
$oauth->enableDebug();

// Start a fresh request
if ( !isset( $_SESSION['access_token'] ) ) {
    if ( !isset( $_SESSION['oauth_token_secret'] ) ) {
        $token = $oauth->getRequestToken( 'http://api.rdio.com/oauth/request_token', 'http://localhost/musicplayer/api' );
        $_SESSION['oauth_token'] = $token['oauth_token'];
        $_SESSION['oauth_token_secret'] = $token['oauth_token_secret'];

        header( 'Location: ' . 'https://www.rdio.com/oauth/authorize' . '?oauth_token=' . $token['oauth_token'] );

        // Stop script output
        exit();
    } else { // If the token is set, request verifier and get access token

        if ( isset( $_GET['oauth_verifier'] ) ) {
            $oauth->setToken( $_SESSION['oauth_token'], $_SESSION['oauth_token_secret'] );
            $access = $oauth->getAccessToken( 'http://api.rdio.com/oauth/access_token', null, $_GET['oauth_verifier'] );

            if ( isset( $access['error'] ) ) {
                session_destroy();
                die( 'Please re-authenticate with the API' );
            } else {
                // Set the access session variables and away we go
                $_SESSION['access_token'] = $access['oauth_token'];
                $_SESSION['access_secret'] = $access['oauth_token_secret'];
                //print_r( $access );
            }
        } else {
            session_destroy();
            die( 'Please re-authenticate with the API' );
        }
    }
}

print_r( $_SESSION );

?>
<html>
<head>
    <title>Woo!</title>
    <script type="text/javascript" src="js/jquery-1.8.2.min.js"></script>
    <script type="text/javascript" src="js/jquery.rdio.min.js"></script>
    <script type="text/javascript" src="js/jquery.oauth.js"></script>
    <script type="text/javascript">
        $.oauth({
            type: 'POST',
            url: 'http://api.rdio.com/1/',
            data: { method: 'get' },
            consumerKey: 'kumkmfms5yav7jk29frc37dz',
            consumerSecret: 'KQyjQpbea6'
        });
    </script>
</head>
<body>

<div id="rdio-api"></div>

<p>Stuff</p>

</body>
</html>