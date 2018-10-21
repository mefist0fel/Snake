function Input() {
	//  KEY KODES
	//	BACKSPACE: 8,
	//	TAB:       9,	RETURN:   13,
	//	ESC:      27,	SPACE:    32,
	//	PAGEUP:   33,	PAGEDOWN: 34,
	//	END:      35,	HOME:     36,
	//	LEFT:     37,	UP:       38,
	//	RIGHT:    39,	DOWN:     40,
	//	INSERT:   45,	DELETE:   46,
	//	ZERO:     48, ONE: 49, TWO: 50, THREE: 51, FOUR: 52, FIVE: 53, SIX: 54, SEVEN: 55, EIGHT: 56, NINE: 57,
	//	A:        65, B: 66, C: 67, D: 68, E: 69, F: 70, G: 71, H: 72, I: 73, J: 74, K: 75, L: 76, M: 77, N: 78, O: 79, P: 80, Q: 81, R: 82, S: 83, T: 84, U: 85, V: 86, W: 87, X: 88, Y: 89, Z: 90,
	//	TILDA:    192

	var input = {
		key: [200],
		mouseLeft: false,
		mousePosition: [0, 0]
	}
	for(var i = 0; i < 200; i++) {
		input.key[i] = false
	}

	function setKey(keyCode, value) {
		input.key[keyCode] = value
	}

	function onKeyDown(event) {
		setKey(event.keyCode, true)
	}
	function onKeyUp(event) {
		setKey(event.keyCode, false)
	}

	function onClick(event) {}

	function mouseDown(event) {
		input.mouseLeft = true
		input.mousePosition[0] = event.clientX
		input.mousePosition[1] = event.clientY
	}

	function mouseUp(event) {
		input.mouseLeft = false
		input.mousePosition[0] = event.clientX
		input.mousePosition[1] = event.clientY
	}

	function mouseMove(event) {
		input.mousePosition[0] = event.clientX
		input.mousePosition[1] = event.clientY
	}

	function onTouchStart(event) {
	}

	function onTouchMove(event) {
	}

	function onTouchEnd(event) {
	}

	function onTouchCancel(event) {
	}

	document.addEventListener('keydown',     onKeyDown,    false)
	document.addEventListener('keyup',       onKeyUp,      false)
	document.addEventListener('click',		 onClick,	  false)
	document.addEventListener('mousedown',   mouseDown,	  false)
	document.addEventListener('mouseup',	 mouseUp,	  false)
	document.addEventListener('mousemove',	 mouseMove,	  false)
	document.addEventListener('touchstart',  onTouchStart, false)
	document.addEventListener('touchmove',	 onTouchMove,  false)
	document.addEventListener("touchend", 	 onTouchEnd, false);
	document.addEventListener("touchcancel", onTouchCancel, false);
	return input;
}