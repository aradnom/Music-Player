<?php $this->load->view( 'inc/header.php', array( 'title' => $title, 'api' => $api ) ); ?>

	<p>Word up, son!</p>

	<div id="api-rdio"></div>

	<div id="api-rdio-controls">
		<div class="previous"></div>
		<div class="play"></div>
		<div class="pause"></div>
		<div class="next"></div>
	</div>

<?php $this->load->view( 'inc/footer.php', array() ); ?>