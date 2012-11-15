<?php
// Handles OAuth authentication for an API using the standard PHP OAuth library -
// assumes OAuth 1.0
// Takes an API Key/Secret and will return an access token as a $_SESSION var

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

	public function __construct () {

		if ( function_exists('get_instance') )
			$this->ci = get_instance();

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
            		$this->ci->session->unset_userdata( array( 'api' => array( 'rdio' => '' ) ) );
            		//print_r( $e->debugInfo['headers_recv'] );
            }
            
            //print_r( $access );
            
            if ( isset( $access['error'] ) ) {
                $this->ci->session->unset_userdata( array( 'api' => array( 'rdio' => '' ) ) );
            } else {
                // Set the access session variables and away we go
                $this->ci->session->set_userdata( array( 'api' => array( 'rdio' => array(
                	'access_token' => $access['oauth_token'],
                	'access_secret' => $access['oauth_token_secret']
                ))));
            }            
        }
	}

	public function set_auth () {
		if ( $this->api_key && $this->access_token ) {
			$this->oauth = new OAuth( $this->api_key, $this->shared_secret );
			$this->oauth->enableDebug();

			$this->oauth->setToken( $this->access_token, $this->access_secret );
			//echo $this->api_key . ' ' . $this->shared_secret . ' ' . $this->access_token . ' ' . $this->access_secret;
		}		
	}

	public function fetch ( $url ) {
		if ( $this->oauth ) {
			try {
				$this->oauth->fetch( $url );
            } catch ( OAuthException $e ) {
            	//if ( stristr( $e->debugInfo['headers_recv'], '401') ) // Token is expired, start over
            		//$this->ci->session->unset_userdata( array( 'api' => array( 'rdio' => '' ) ) );
            		//print_r( $e->debugInfo['headers_recv'] );
            	print_r( $e );
            }
			
			
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

}

?>
