<?php $this->load->view( 'inc/header.php', array( 'title' => $title ) ); ?>

	<p>Word up, son!</p>

	<div id="controls">
		<div id="previous">previous</div>
		<div id="play">play</div>
		<div id="stop">stop</div>
		<div id="next">next</div>
	</div>

	<input type="text" id="search" name="search" />

	<div id="search-results" name="search-results"></div>

	<canvas id="playlist" width="800" height="600" style="border: 1px solid red;"></canvas>

	<div id="playlist-list"><div id="add">add</div></div>

	<div id="api-rdio"></div>

	<div id="canvas-assets">
		<img id="icon-play" src="/assets/img/play.png" />
	</div>

	<!-- Templates -->

	<script type="text/template" id="track-template">
		
		<div class="track-source"><%- source %></div>
		<div class="track-title"><%- title %></div>
		<div class="track-artist"><%- artist %></div>
		<div class="track-album"><%- album %></div>
		<img class="track-icon" src="<%- icon %>" />
		<div class="play-keys">
			<div class="key-rdio"><%- rdioKey %></div>
			<div class="key-spotify"><%- spotifyKey %></div>
		</div>
		
	</script>

	<script type="text/template" id="search-result-template">
		
		<div class="track-artist"><%- artist %></div>
		<span> - </span>
		<div class="track-title"><%- title %></div>		
		<div class="track-album"><%- album %></div>
		
		<div class="search-result-menu">
			<div class="add-to-playlist">Add to Q</div>
			<div class="play">Play now</div>
		</div>
		
	</script>

<?php $this->load->view( 'inc/footer.php', array() ); ?>
