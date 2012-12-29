<?php

class Users extends CI_Model {

	private $user;
	
	function __construct () {

		parent::__construct();
		$this->load->library( 'Mongo_db' );

	}

	function get_user_info () {

		if ( $this->user ) {
			// Get current user data from db        
	        $user_info = $this->mongo_db->where( array(
	            'username' => $this->user
	        ))->get( 'users' );

	        // Should always be the first row as these are assumed to be unique
	        return ! empty( $user_info ) ? $user_info[0] : false;
		}		

	}

	function set_user ( $user ) {

		$this->user = $user;

	}

}

?>