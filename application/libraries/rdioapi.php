<?php

// API functionality specific to the music service.  This may simply
// be authentication or may be more involved depending on whether
// API functions are preferred to be in PHP or JavaScript.

class RdioAPI {
	private $ci; // Codeigniter instance
	private $auth = false;
	private $oauth = null; // OAuth instance for making authenticated requests
	private $results = null;

	// OAuth vars
	private $api_key = null;
	private $shared_secret = null;
	private $access_token = null;
	private $access_secret = null;

	// API-specific URLs
	private $request_url = 'http://api.rdio.com/oauth/request_token';
	private $authorize_url = 'https://www.rdio.com/oauth/authorize';
	private $access_url = 'http://api.rdio.com/oauth/access_token';
	private $api_url = 'http://api.rdio.com/1/';
	private $callback_url;

	function __construct ( $keys ) {

		// Make sure oauth class exists before doing anything else
		if ( ! class_exists( "API_OAuth" ) )
			die( 'Load the API_OAuth library before proceeding.' );

		if ( function_exists('get_instance') )
			$this->ci = get_instance();

		if ( ! $keys )
			die( 'API key and shared secret must be set before using.' );

		$this->api_key = $keys['api_key'];
		$this->shared_secret = $keys['shared_secret'];

	}

	function authenticate ( $callback_url ) {

		$this->callback_url = $callback_url;

		// Check for oauth token in session before doing anything else
		$oauth = $this->ci->session->userdata('api'); 

		// This is the first step of the auth process
		if ( ! isset( $oauth['rdio']['oauth_token'] ) )
			$this->request_token();

		// This is the second part of the auth process
		if ( $this->ci->input->get( 'oauth_verifier' ) )
			$this->request_access( $this->ci->input->get( 'oauth_verifier' ) );

	}

	function request_token () {

		$this->ci->api_oauth->get_oauth_request_token( $this->api_key, $this->shared_secret, $this->request_url, $this->authorize_url, $this->access_url, $this->callback_url );

		$this->ci->session->set_userdata( array( 
			'api' => array( 'rdio' => array(
					'oauth_token' => $this->ci->api_oauth->get_oauth_token(), 
					'oauth_token_secret' => $this->ci->api_oauth->get_oauth_token_secret()		
		))));

		// Redirect to Rdio auth page
		header( 'Location: ' . $this->authorize_url . '?oauth_token=' . $this->ci->api_oauth->get_oauth_token() );

	    // Stop script output
	    exit();	

	}

	// Request access token if authentication went okay
	function request_access ( $verifier ) {

		$api_data = $this->ci->session->userdata( 'api' );

		if ( isset( $api_data['rdio']['oauth_token'] ) ) {
			$this->ci->api_oauth->set_key( $this->api_key );
			$this->ci->api_oauth->set_secret( $this->shared_secret );
			$this->ci->api_oauth->set_oauth_token( $api_data['rdio']['oauth_token'] );
			$this->ci->api_oauth->set_oauth_token_secret( $api_data['rdio']['oauth_token_secret'] );
			$this->ci->api_oauth->set_access_url( $this->access_url );
			$this->ci->api_oauth->set_verifier( $verifier );
			$this->ci->api_oauth->get_oauth_access_token();
		}		

	}

	function set_auth ( $rdio_data) {

		$this->access_token = $rdio_data['access_token'];
		$this->access_secret = $rdio_data['access_secret'];

		if ( $rdio_data && $this->ci->api_oauth ) {
			$this->ci->api_oauth->set_key( $this->api_key );
			$this->ci->api_oauth->set_secret( $this->shared_secret );
			$this->ci->api_oauth->set_access_token( $this->access_token );
			$this->ci->api_oauth->set_access_secret( $this->access_secret );
			$this->ci->api_oauth->set_auth();

			$this->auth = true;
		}
			
	}

	// Beginning of API methods ///////////////////////////////////////////

	// Requires API authentication beore using
	function getPlaybackToken ()  {
		if ( $this->auth ) {
			$this->ci->api_oauth->fetch( $this->api_url, array( 'method' => 'get' ), OAUTH_HTTP_METHOD_POST );
			echo "Done";
		}
	}

}

?>