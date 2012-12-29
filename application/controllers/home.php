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

        // Set user info in session - javascript will take care of the rest    
        $this->load->library( 'session' );
        $this->session->set_userdata( array(
            'username' => 'me',
            'api' => $user['api'],
            'auth' => true
        ));                    

        // Make sure page exists before showing view
        if ( file_exists( 'application/views/content/index.php' ) ) {

            // Set template variables
            $data['title'] = 'Dat title';

            // Load index view and away we go
            $this->load->view( 'content/index', $data );

        } else

            show_404();

    }
}