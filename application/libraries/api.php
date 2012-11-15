<?php
class MusicAPI {
	
	function __construct () {
		// Make sure oauth class exists before doing anything else
		if ( !class_exists( "API_OAuth" ) )
			die( 'Include OAuth class before using this.' );
	}

	function getAPIAccess ( $user, $pass ) {
		
	}

}
?>