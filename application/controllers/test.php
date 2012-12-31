<?php

class Test extends CI_Controller {

	public function __construct () {

		parent::__construct();
		$this->load->library( 'Api_oauth' );
		$this->load->model( 'Admin' );

	}

	public function get_playback_token () {

		$this->api_oauth->set_api_key( $this->Admin->api( 'rdio' )->api_key() );
		$this->api_oauth->set_shared_secret( $this->Admin->api( 'rdio' )->shared_secret() );
		$this->api_oauth->set_auth();

		print_r ( $this->api_oauth->fetch( $this->Admin->api( 'rdio' )->api_root(), array(
			'method' => 'getPlaybackToken',
			'domain' => 'musicplayer.local'
		)));

		//print_r( $this->Admin->api( 'rdio' )->api_key() );

	}

}

?>
