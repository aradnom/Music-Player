// App templates

var Player = ( function ( player ) {

	player.Templates = {
		track_template: '',
		search_results_template: ' \
		<div class="result__container pointer"> \
			<div class="result__type">track</div> \
			<div class="result__content"><%= artist %> - <%= title %></div> \
			<% if ( relevance ) { %> \
				<div class="result__relevance"> \
					<div class="relevance__inner" style="width: <%= relevance * 100 %>%;"></div> \
				</div> \
			<% } %> \
			<div class="result__icon icon-<%= source %>"></div> \
		</div> \
		'
	};

	return player;

})( Player || { Models: {}, Views: {}, Collections: {}, Cache: {} } );