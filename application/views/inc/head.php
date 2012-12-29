
<head>
    <title><?php echo $title ?></title>
    <script type="text/javascript" src="/assets/js/jquery-1.8.2.min.js"></script>
    <script type="text/javascript" src="/assets/js/jquery.oauth.js"></script>
    <script type="text/javascript" src="/assets/js/jquery.rdio.min.js"></script>
    <script type="text/javascript" src="/assets/js/paper.js"></script>
    <script type="text/javascript" src="/assets/js/playlist.js"></script>    
    <script type="text/javascript" src="/assets/js/underscore.js"></script>
    <script type="text/javascript" src="/assets/js/backbone.js"></script>    
    <script type="text/javascript">
    	$(function () {

            // Get the playback token and set before setting up controls
    		$.post( 'rdio_api/get_playback_token', {}, function ( response ) { 
                var parsed = $.parseJSON( response );

                if ( parsed && parsed.playback_token )
                    $('#api-rdio').rdio( parsed.playback_token );
            });

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

            $('#rdio-search').keyup( function () {
                if ( $(this).val().length > 2 ) {
                    $.post( 'rdio_api/search', { 'query': $(this).val(), 'types': 'Artist' }, function ( response ) { 
                        //console.log( response );
                        var parsed = $.parseJSON( response );

                        console.log( parsed );

                        if ( parsed && parsed.result ) {
                            $('#rdio-results').html( '' );

                            $.each( parsed.result.results, function () {
                                $('#rdio-results').append( '<div class="rdio-result"><div class="icon"><img src="' + this.icon + '" /></div></div>' );
                            });    
                        }

                    });
                }
            });

    	});
    </script>
</head>