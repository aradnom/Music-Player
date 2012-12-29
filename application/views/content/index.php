<?php $this->load->view( 'inc/header.php', array( 'title' => $title ) ); ?>

	<p>Word up, son!</p>

	<input type="text" id="rdio-search" name="rdio-search" />

	<div id="rdio-results" name="rdio-results"></div>

	<canvas id="playlist" width="800" height="600"></canvas>

	<div id="api-rdio"></div>

	<div id="api-rdio-controls">
		<div class="previous"></div>
		<div class="play"></div>
		<div class="pause"></div>
		<div class="next"></div>
	</div>

	<img src="/assets/img/phone.png" id="phone" />

<?php $this->load->view( 'inc/footer.php', array() ); ?>