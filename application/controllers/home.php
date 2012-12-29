<?php

class Home extends CI_Controller {

    public function index () {

        // Load admin information
        $this->load->model( 'Admin' );

        // Load the database users model
        $this->load->model( 'Users' );

        // Set the user from login
        $this->Users->set_user( 'me' );

        // Get user info
        $user = $this->Users->get_user_info();

        // Set user info in session     
        $this->load->library( 'session' );
        $this->session->set_userdata( array(
            'username' => 'me',
            'api' => $user['api'],
            'auth' => true
        ));   

        // Load OAuth library, necessary for all OAuth fetch requests
        $this->load->library( 'Api_oauth' );           

        // Verify the user exists before doing anything else
        if ( $user ) {

            // Set up Rdio API access if it exists
            if ( isset( $user['api']['rdio'] ) ) {
                // Load API
                $this->load->model( 'Rdio' ); 

                // Set API info
                $this->api_oauth->set_api_key( $this->Admin->api( 'rdio' )->api_key() );
                $this->api_oauth->set_shared_secret( $this->Admin->api( 'rdio' )->shared_secret() );
                $this->Rdio->set_authentication( $user['api']['rdio'] ); 
            }
                            

        } else

            die( 'You\'re not in the system.' );              

        print_r( $this->Rdio->search( 'cher' ) );

        // Make sure page exists before showing view
        if ( file_exists( 'application/views/content/index.php' ) ) {

            // Set template variables
            $data['title'] = 'Dat title';

            // Load index view
            $this->load->view( 'content/index', $data );

        } else

            show_404();
    }
}