<?php

class Home extends CI_Controller {

    public function index () {          
        $this->load->library( 'session' );
        $this->load->library( 'mongo_db' );
        $this->load->library( 'api_oauth' );
        $this->load->library( 'RdioAPI', array( 'api_key' => 'kumkmfms5yav7jk29frc37dz', 'shared_secret' => 'KQyjQpbea6' ) );

        // Get current api data
        $api_data = $this->session->userdata( 'api' );

        // Authenticate Rdio if necessary
        // Check for access token in db and do stuff if it isn't there
        
        print_r( $api_data );

        // Set up Rdio API access
        if ( ! isset( $api_data['rdio']['access_token'] ) )
            $this->rdioapi->authenticate( 'http://localhost/musicplayer/' );
        else 
            $this->rdioapi->set_auth( $api_data['rdio'] );

        $this->rdioapi->getPlaybackToken();

        // Make sure page exists
        if ( file_exists( 'application/views/pages/index.php' ) ) {

            $data['title'] = 'Dat title';

            // Load view stack
            $this->load->view( 'templates/header', $data );
            $this->load->view( 'pages/index', $data );
            $this->load->view( 'templates/footer', $data );

        } else

            show_404();
    }
}