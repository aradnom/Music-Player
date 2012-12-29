<?php

// API functionality specific to the music service.  This may simply
// be authentication or may be more involved depending on whether
// API functions are preferred to be in PHP or JavaScript.

class Auth_rdio {
	private $ci; // Codeigniter instance
	private $auth = false;
	private $oauth = null; // OAuth instance for making authenticated requests
	private $results = null;
	private $error = null;
	private $user = null;

	// OAuth vars
	private $api_key = null;
	private $shared_secret = null;
	private $access_token = null;
	private $access_secret = null;

	// API-specific auth URLs
	private $request_url = 'http://api.rdio.com/oauth/request_token';
	private $authorize_url = 'https://www.rdio.com/oauth/authorize';
	private $access_url = 'http://api.rdio.com/oauth/access_token';
	private $api_url = 'http://api.rdio.com/1/';
	private $callback_url;

	// API method vars
	private $playback_token = null;

	function __construct ( $args ) {

		// Make sure oauth class exists before doing anything else
		if ( ! class_exists( "API_OAuth" ) )
			die( 'Load the API_OAuth library before proceeding.' );

		if ( function_exists('get_instance') )
			$this->ci = get_instance();

		if ( ! $args )
			die( 'API key and shared secret must be set before using.' );

		$this->api_key = $args['api_key'];
		$this->shared_secret = $args['shared_secret'];
		$this->user = $args['user'];

		// Load URL library
		$this->ci->load->helper( 'url' );

	}

	//////////////////////////////////////////////////////////////////
	// Authentication functions //////////////////////////////////////
	//////////////////////////////////////////////////////////////////

	function authenticate ( $user, $callback_url ) {

		$this->callback_url = $callback_url;
		$this->user = $user;

		// This is the first step of the auth process
		if ( ! isset( $user['api']['rdio']['oauth_token'] ) )
			$this->request_token();

		// This is the second part of the auth process
		if ( $this->ci->input->get( 'oauth_verifier' ) )
			$this->request_access( $this->ci->input->get( 'oauth_verifier' ) );

	}

	function request_token () {

		$this->ci->api_oauth->get_oauth_request_token( $this->api_key, $this->shared_secret, $this->request_url, $this->authorize_url, $this->access_url, $this->callback_url );

		$this->ci->mongo_db->where( array( 'username' => $this->user['username'] ) )->
			set( 'api', array( 'rdio' => array( 
				'oauth_token' => $this->ci->api_oauth->get_oauth_token(),
				'oauth_token_secret' => $this->ci->api_oauth->get_oauth_token_secret()
			) ) )->
			update( 'users' );

		// Redirect to Rdio auth page
		header( 'Location: ' . $this->authorize_url . '?oauth_token=' . $this->ci->api_oauth->get_oauth_token() );

	    // Stop script output
	    exit();	

	}

	// Request access token if authentication went okay
	function request_access ( $verifier ) {

		if ( isset( $this->user['api']['rdio']['oauth_token'] ) ) {
			$this->ci->api_oauth->set_api_name( 'rdio' );
			$this->ci->api_oauth->set_user( $this->user );
			$this->ci->api_oauth->set_key( $this->api_key );
			$this->ci->api_oauth->set_secret( $this->shared_secret );
			$this->ci->api_oauth->set_oauth_token( $this->user['api']['rdio']['oauth_token'] );
			$this->ci->api_oauth->set_oauth_token_secret( $this->user['api']['rdio']['oauth_token_secret'] );
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

	///////////////////////////////////////////////////////////////////////
	// Beginning of API methods ///////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////

	// Requires API authentication beore using
	function getPlaybackToken ( $domain = 'localhost' )  {
		if ( $this->auth ) {
			$this->results = $this->ci->api_oauth->fetch( $this->api_url, array( 'method' => 'getPlaybackToken', 'domain' => $domain ), OAUTH_HTTP_METHOD_POST );
			
			if ( isset( $this->results->error ) ) {

				$this->error = $this->results->error;

				return false;

			} else if ( $this->results->status == 'ok' ) { // Playback token request was successful

				$this->ci->mongo_db->where( array( 'username' => $this->user['username'] ) )->
					set( 'api.rdio.playback_token', $this->results->result )->
					update( 'users' );

			}
		}
	}

	function getAlbumsForArtist ( $artist, $featuring = null, $extras = null, $start = null, $count = null ) {
		$this->results = $this->ci->api_oauth->fetch( $this->api_url, array(
			'method' => 'getAlbumsForArtist',
			'artist' => $artist
		));

		print_r( $this->results );

		//return $this->results->result;
	}

	function search ( $query, $types = 'Artist,Album', $never_or = null, $extras = null, $start = null, $count = null ) {
		$this->results = $this->ci->api_oauth->fetch( $this->api_url, array(
			'method' => 'search',
			'types' => $types,
			'query' => $query
		));

		print_r( $this->results );
	}

	////////////////////////////////////////////////////////////////////
	// Internal/generic getters/setters ////////////////////////////////
	////////////////////////////////////////////////////////////////////

	function get_error () {
		return $this->error;
	}

	function set_playback_token ( $token ) {
		if ( ! $this->playback_token )
			$this->playback_token = $token;
	}

}

?>