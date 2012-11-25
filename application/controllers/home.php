<?php

class Home extends CI_Controller {

    public function index () {    
        // For now, assume the user is me
        $user = 'me';

        $this->load->library( 'session' );
        $this->load->library( 'mongo_db' );

        // Get current user data from db        
        $user_info = $this->mongo_db->get_where( 'users', array(
            'username' => $user
        ));

        if ( ! empty( $user_info ) )
            $user = $user_info[0]; // Should always be the first row as these are assumed to be unique

        //print_r( $user );

        // Load API libraries and check API access
        $this->load->library( 'API_OAuth', array( 'user' => $user ) );
        $this->load->library( 'API_Rdio', array( 'api_key' => 'kumkmfms5yav7jk29frc37dz', 'shared_secret' => 'KQyjQpbea6', 'user' => $user ) );

        // Set up Rdio API access
        if ( ! isset( $user['api']['rdio']['access_token'] ) )
            $this->api_rdio->authenticate( $user, 'http://localhost/musicplayer/' );
        else 
            // Set auth in the Rdio object
            $this->api_rdio->set_auth( $user['api']['rdio'] );        

        // Get playback token if it doesn't exist
        if ( ! isset( $user['api']['rdio']['playback_token'] ) )
            $this->api_rdio->getPlaybackToken( 'musicplayer.local' );
        else
            $this->api_rdio->set_playback_token( $user['api']['rdio']['playback_token'] );

        // Load everything into data
        $data['api']['rdio'] = $user['api']['rdio'];

        $this->api_rdio->search( 'cher' );

        // Make sure page exists
        if ( file_exists( 'application/views/content/index.php' ) ) {

            $data['title'] = 'Dat title';

            // Load index view
            $this->load->view( 'content/index', $data );

        } else

            show_404();
    }
}