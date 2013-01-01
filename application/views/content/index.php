<?php $this->load->view( 'inc/header.php', array( 'title' => $title ) ); ?>

	<p>Word up, son!</p>

	<input type="text" id="rdio-search" name="rdio-search" />

	<div id="rdio-results" name="rdio-results"></div>

	<canvas id="playlist" width="800" height="600"></canvas>

	<div id="playlist-list"><div id="add">add</div></div>

	<div id="api-rdio"></div>

	<img src="/assets/img/phone.png" id="phone" />

	<!-- Templates -->

	<script type="text/template" id="song-template">
		<div class="track">
			<div class="track-icon"></div>
			<div class="track-name"></div>
			<div class="track-album"></div>
		</div>
	</script>

<?php $this->load->view( 'inc/footer.php', array() ); ?>