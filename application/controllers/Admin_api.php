<?php

// Class for retrieving useful admin information such as API keys.  Note this only
// applies to public-facing information.  Private info such as OAuth token cannot
// be accessed via this controller.

class Admin_api extends CI_Controller {
	
	public function __construct () {

		parent::__construct();

		// Make sure this is an ajax request
        if ( ! $this->input->is_ajax_request() )
            die( json_encode( array( 'error' => 'No direct access.' ) ) );

		// Load the admin model
		$this->load->model( 'Admin' );

	}

	// Expects API name in the post
	public function get_api_key () {

		if ( ! $this->input->post( 'api' ) )
			die( json_encode( array( 'error' => 'Must supply API type.' ) ) );

		// Only retrieve specified API info, not all of it
		switch ( $this->input->post( 'api' ) ) {
			case 'lastfm':
				echo json_encode( array( 'api_key' => $this->Admin->api( 'lastfm' )->api_key() ) );
			break;
		}

	}

	// Expects API name in the post
	public function get_api_root () {

		if ( ! $this->input->post( 'api' ) )
			die( json_encode( array( 'error' => 'Must supply API type.' ) ) );

		// Only retrieve specified API info, not all of it
		switch ( $this->input->post( 'api' ) ) {
			case 'lastfm':
			case 'rdio':
			case 'spotify':
				echo json_encode( array( 'api_root' => $this->Admin->api( $this->input->post( 'api' ) )->api_root() ) );
			break;
		}

	}

}

?>