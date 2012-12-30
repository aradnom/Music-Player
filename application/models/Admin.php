<?php

// Contains admin/config data such as API keys which is stored in the database

class Admin extends CI_Model {

	private $admin = null;
	private $api = null;
	
	function __construct () {

		parent::__construct();
		$this->load->library( 'Mongo_db' );

	}

	// Return all admin info
	function admin () {

		$this->get_admin();
		return $this->admin;

	}

	// Return either all API info or specific API info (if specified)
	function api ( $which = null ) {

		// Check for existing query before making a new one
		if ( ! $this->admin )
			$this->get_admin();

		// Then return based on specified API or all
		if ( $this->admin )
			if ( $which )
				$this->api = $this->admin['api'][$which]; // Set up for chaining
			else
				return $this->admin['api']; // Otherwise just return all the API info

		return $this;

	}

	// Return API key from specific API - chained from this->api()
	function api_key () {

		return $this->api ? $this->api['api_key'] : false;

	}

	// Return API secret from specific API - chained from this->api()
	function shared_secret () {

		return $this->api ? $this->api['shared_secret'] : false;

	}

	// Return API root URL - chained from this->api()
	function api_root () {

		return $this->api ? $this->api['api_root'] : false;

	}

	// Retrieve all admin info from db
	private function get_admin () {

		// Get current user data from db    
		$results = $this->mongo_db->get( 'admin' );
		$this->admin = ! empty( $results ) ? $results[0] : false;

	}

}

?>