<?php

class Pages extends CI_Controller {

    public function view( $page = 'home' ) {
        // Make sure page exists
        if ( file_exists( 'application/views/pages/' . $page . '.php' ) ) {
            $data['title'] = 'Dat title';

            // Load view stack
            $this->load->view( 'templates/header', $data );
            $this->load->view( 'pages/' . $page, $data );
            $this->load->view( 'templates/footer', $data );
        } else

            show_404();
    }
}