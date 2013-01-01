// Dynamic playlist-related code for canvas
// Requires jQuery

$( function () {

	paper.setup( $('#playlist')[0] );

	 // Create a Paper.js Path to draw a line into it:
    var path = new paper.Path();
    // Give the stroke a color
    path.strokeColor = 'black';
    var start = new paper.Point(100, 100);
    // Move to start and draw a line from there
    path.moveTo(start);
    // Note that the plus operator on Point objects does not work
    // in JavaScript. Instead, we need to call the add() function:
    path.lineTo(start.add( [ 200, -50 ] ));

    var image = new paper.Raster( 'phone' );

    image.position = paper.view.center;

    paper.view.onFrame = function ( event ) {
        paper.view.draw();
    }    

});