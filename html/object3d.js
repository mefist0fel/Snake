
function Object3D(positionVector3) {
	var object3D = {
		position: positionVector3,
		screenPosition: CreateVector3(),
		color: '#FFEEEE',
		prepareScene: function (camera) {
			this.screenPosition = camera.WorldToScreenVector3(this.position)
		},
		draw: function (canvas) {
			canvas.fillStyle = color;
			canvas.beginPath();
			canvas.arc(screenPosition[0], screenPosition[1], 3, 0, 2.0 * Math.PI);
			canvas.closePath();
			canvas.fill();
		}
	}
	return object3D;
}