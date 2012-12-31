<?php

// API controller for Rdio.  User access needs to be set to use this
// Methods should not be called outside of ajax
// Params should be shipped in the post

class Rdio_api extends CI_Controller {

    private $api_info = null;

    public function __construct () {

        parent::__construct();

        // Make sure this is an ajax request
        if ( ! $this->input->is_ajax_request() )
            die( json_encode( array( 'error' => 'No direct access.' ) ) );

        $this->load->library( 'session' );

        // Make sure user is set
        //if ( ! $this->session->userdata( 'auth' ) )
        //    die( json_encode( array( 'error' => 'Must be logged in to make API requests.' ) ) );

        // Load admin information for API keys
        $this->load->model( 'Admin' );

        // Load API model
        $this->load->model( 'Rdio' );

        // Load OAuth library
        $this->load->library( 'Api_oauth' );

        $this->api_oauth->set_api_key( $this->Admin->api( 'rdio' )->api_key() );
        $this->api_oauth->set_shared_secret( $this->Admin->api( 'rdio' )->shared_secret() );

        // See if user has Rdio access
        $this->api_info = $this->session->userdata( 'api' );

        // If so, set up oauth tokens
        if ( $this->api_info['rdio'] )
            $this->api_info = $this->api_info['rdio']; // We only care about the rdio bits
            
        $this->Rdio->set_authentication( $this->api_info ); 

    }

    // Args: 'query', 'types' = 'Artist,Album,Track,Playlist,User', 'never_or' = bool, 'extras' = fields, comma-separated, 
    // 'start' = int, 'count' = int
    public function search () {      

        // Make sure the required stuff is there
        if ( ! $this->input->post( 'query' ) )
            die( json_encode( array( 'error' => 'Must send query.' ) ) ); 

        if ( ! $this->input->post( 'types' ) )
            die( json_encode( array( 'error' => 'Must include at least one of: Artist, Album, Track, Playlist, User.' ) ) );

        // If that worked out, send the query.  Note this just forwards the POST - args that
        // aren't recognized will just be ignored by the API

        echo json_encode( $this->Rdio->search( $this->input->post() ) );       

    }

    function get_playback_token () {

        if ( $this->api_info )
            echo json_encode( array( 'playback_token' => $this->api_info['playback_token'] ) );

    }
}