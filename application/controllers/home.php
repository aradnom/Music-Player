<?php

class Home extends CI_Controller {

    public function index () {    

        // Load the database users model
        $this->load->model( 'Users' );

        // Get user info
        $user = $this->Users->get_user_info();

        // Load OAuth library
        $this->load->library( 'Api_oauth', array( 'user' => $user ) );        

        // Load API models
        $this->load->model( 'Rdio', '', array( 
            'api_key' => 'kumkmfms5yav7jk29frc37dz', 
            'shared_secret' => 'KQyjQpbea6', 
            'user' => $user 
        ));        

        // Verify the user exists before doing anything else
        /*if ( $user ) {

            // Set up Rdio API access if it exists
            if ( isset( $user['api']['rdio'] ) )
                $this->Rdio->authenticate( $user['api']['rdio'], 'http://localhost/musicplayer/' );

        } else

            die( 'You\'re not in the system.' );       

        // Load credentials into data
        $data['api']['rdio'] = $user['api']['rdio'];

        $this->Rdio->search( 'cher' );

        // Make sure page exists before showing view
        if ( file_exists( 'application/views/content/index.php' ) ) {

            $data['title'] = 'Dat title';

            // Load index view
            $this->load->view( 'content/index', $data );

        } else

            show_404();*/
    }
}