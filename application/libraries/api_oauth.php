<?php
// Handles OAuth authentication for an API using the standard PHP OAuth library -
// assumes OAuth 1.0
// Takes an API Key/Secret and will return an access token in the user's db entry

class API_OAuth {
	private $oauth = null;

	// API-specific URLs
	private $request_url;
	private $authorize_url;
	private $access_url;
	private $callback_url;

	// OAuth vars
	private $api_key;
	private $shared_secret;
	private $oauth_token = null;
	private $oauth_token_secret = null;
	private $verifier = null;
	private $access_token = null;
	private $access_secret = null;

	// Other vars
	private $api_name = null;
	private $response = null;
	private $user = null;

	public function __construct ( $args ) {

		if ( function_exists('get_instance') )
			$this->ci = get_instance();

		if ( ! $args )
			die( 'User info must be set before using.' );

		$this->user = $args['user'];

	}	

	public function get_oauth_request_token ( $api_key, $shared_secret, $request_url, $authorize_url, $access_url, $callback_url ) {
		// Saves vars
		$this->api_key = $api_key;
		$this->shared_secret = $shared_secret;
		$this->request_url = $request_url;
		$this->authorize_url = $authorize_url;
		$this->access_url = $access_url;

		// Create new OAuth object and setup new request
		$oauth = new OAuth( $api_key, $shared_secret );
		$oauth->enableDebug();
		
		// Request new token here if it hasn't happened yet
	    if ( ! $this->oauth_token ) {	
	    	try {
	    		$token = $oauth->getRequestToken( $request_url, $callback_url );
	    	} catch ( OAuthException $e ) {
            	print_r( $e );
            } 	
	              
	        $this->oauth_token = $token['oauth_token'];
	        $this->oauth_token_secret = $token['oauth_token_secret'];
	    }
	}

	// If the token is set, request verifier and get access token
	public function get_oauth_access_token () {

		if ( isset( $this->verifier ) ) {
			$oauth = new OAuth( $this->api_key, $this->shared_secret );
			$oauth->enableDebug();

            $oauth->setToken( $this->oauth_token, $this->oauth_token_secret );

            try {
            	$access = $oauth->getAccessToken( $this->access_url, null, $this->verifier );
            } catch ( OAuthException $e ) {
            	if ( stristr( $e->debugInfo['headers_recv'], '401') ) // Token is expired, start over
            		$this->ci->mongo_db->where( array( 'username' => $this->user['username'] ) )->
						unset_field( 'api.' . $this->api_name )->
						update( 'users' );
            }
            
            if ( isset( $access['error'] ) ) {
            	$this->ci->mongo_db->where( array( 'username' => $this->user['username'] ) )->
            		unset_field( 'api.' . $this->api_name )->
            		update( 'users' );
            } else {
                // Set the access variables in the db and away we go
                $this->ci->mongo_db->where( array( 'username' => $this->user['username'] ) )->
					set( 'api', array( $this->api_name => array( 
						'oauth_token' => $this->user['api']['rdio']['oauth_token'],
						'oauth_token_secret' => $this->user['api']['rdio']['oauth_token_secret'],
						'access_token' => $access['oauth_token'],
						'access_secret' => $access['oauth_token_secret']
					) ) )->
					update( 'users' );
            }            
        }
	}

	public function set_auth () {
		if ( $this->api_key && $this->access_token ) {
			$this->oauth = new OAuth( $this->api_key, $this->shared_secret );
			$this->oauth->enableDebug();

			$this->oauth->setToken( $this->access_token, $this->access_secret );
		}		
	}

	public function fetch ( $url, $args, $method = OAUTH_HTTP_METHOD_POST ) {
		if ( $this->oauth ) {
			try {
				$this->oauth->fetch( $url, $args, $method );
				$this->response = json_decode( $this->oauth->getLastResponse() );
            } catch ( OAuthException $e ) {
            	print_r( $e );
            }
			
			return $this->response;
		}
	}

	public function get_oauth_token () {
		return $this->oauth_token;
	}

	public function get_oauth_token_secret () {
		return $this->oauth_token_secret;
	}

	public function get_verifier () {
		return $this->verifier;
	}

	public function get_access_token () {
		return $this->access_token;
	}

	public function get_access_secret () {
		return $this->access_secret;
	}

	public function set_key ( $key ) {
		$this->api_key = $key;
	}

	public function set_secret ( $secret ) {
		$this->shared_secret = $secret;
	}

	public function set_oauth_token ( $token ) {
		$this->oauth_token = $token;
	}

	public function set_oauth_token_secret ( $token_secret ) {
		$this->oauth_token_secret = $token_secret;
	}

	public function set_verifier ( $verifier ) {
		$this->verifier = $verifier;
	}

	public function set_access_token ( $token ) {
		$this->access_token = $token;
	}

	public function set_access_secret ( $secret ) {
		$this->access_secret = $secret;
	}

	public function set_request_url ( $url ) {
		$this->request_url = $url;
	}

	public function set_authorize_url ( $url ) {
		$this->authorize_url = $url;
	}

	public function set_access_url ( $url ) {
		$this->access_url = $url;
	}

	// The name of the API we're currently working with
	public function set_api_name ( $name ) {
		$this->api_name = $name;
	}

	public function set_user ( $user ) {
		$this->user = $user;
	}

}

?>
