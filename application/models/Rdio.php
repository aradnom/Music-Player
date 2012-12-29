<?php

class Rdio extends CI_Model {

	private $auth = false;
	private $results = null;
	private $error = null;
	private $user = null;

	// OAuth vars, necessary for all API requests
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
	
	function __construct () {

		parent::__construct();

		// Load URL library
		$this->load->helper( 'url' );
		
	}

	///////////////////////////////////////////////////////////////////////
	// Beginning of API methods ///////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////

	// Requires API authentication beore using
	function getPlaybackToken ( $domain = 'musicplayer.local' )  {

		if ( $this->auth ) {
			$this->results = $this->api_oauth->fetch( $this->api_url, array( 'method' => 'getPlaybackToken', 'domain' => $domain ), OAUTH_HTTP_METHOD_POST );
			
			if ( isset( $this->results->error ) ) {

				$this->error = $this->results->error;

				return false;

			} else if ( $this->results->status == 'ok' ) { // Playback token request was successful

				$this->mongo_db->where( array( 'username' => $this->user['username'] ) )->
					set( 'api.rdio.playback_token', $this->results->result )->
					update( 'users' );

			}
		}

	}

	function getAlbumsForArtist ( $artist, $featuring = null, $extras = null, $start = null, $count = null ) {

		$this->results = $this->api_oauth->fetch( $this->api_url, array(
			'method' => 'getAlbumsForArtist',
			'artist' => $artist
		));

		return $this->results->result;

	}

	// Args: 'query', 'types' = 'Artist,Album,Track,Playlist,User', 'never_or' = bool, 'extras' = fields, comma-separated, 
	// 'start' = int, 'count' = int
	function search ( $args ) {

		$args['method'] = 'search';

		$this->results = $this->api_oauth->fetch( $this->api_url, $args );

		return ! empty( $this->results ) ? $this->results : false;
		
	}

	//////////////////////////////////////////////////////////////////
	// Authentication functions //////////////////////////////////////
	//////////////////////////////////////////////////////////////////

	function set_authentication ( $api_info ) {

		if ( $api_info && $this->api_oauth ) {
			$this->api_oauth->set_access_token( $api_info['access_token'] );
			$this->api_oauth->set_access_secret( $api_info['access_secret'] );
			$this->api_oauth->set_auth();

			$this->auth = true;
		}
			
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