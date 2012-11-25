
<head>
    <title><?php echo $title ?></title>
    <script type="text/javascript" src="/assets/js/jquery-1.8.2.min.js"></script>
    <script type="text/javascript" src="/assets/js/jquery.oauth.js"></script>
    <script type="text/javascript" src="/assets/js/jquery.rdio.min.js"></script>
    <script type="text/javascript">
    	$(function () {

    		$('#api-rdio').rdio('<?php echo $api['rdio']['playback_token']; ?>');

    		// Rdio controls

    		$('#api-rdio-controls .play').click( function () {
    			$('#api-rdio').rdio().play();
    		});

    		$('#api-rdio-controls .pause').click( function () {
    			$('#api-rdio').rdio().pause();
    		});

    		$('#api-rdio-controls .previous').click( function () {
    			$('#api-rdio').rdio().previous();
    		});

    		$('#api-rdio-controls .next').click( function () {
    			$('#api-rdio').rdio().next();
    		});

    	});
    </script>
</head>