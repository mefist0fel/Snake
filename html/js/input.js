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
		mousePosition: [0, 0],
		touches: [],
		isTouchRect: function (rectSX, rectSY, rectEX, rectEY) {
			if (this.mouseLeft && inRect(this.mousePosition[0], this.mousePosition[1], rectSX, rectSY, rectEX, rectEY))
				return true
			for(let i = 0; i < this.touches.length; i++) {
				if (inRect(this.touches[i][0], this.touches[i][1], rectSX, rectSY, rectEX, rectEY))
					return true
			}
			return false
		}
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

	function onTouch(event) {
		input.touches = []
		for(let i = 0; i < event.touches.length; i++) {
			input.touches.push([event.touches[i].clientX, event.touches[i].clientY])
		}
		event.preventDefault()
	}

	function addListener(type, callback) {
		document.addEventListener(type, callback, {passive: false})
	}

	addListener('keydown',		onKeyDown)
	addListener('keyup',		onKeyUp)
	addListener('click',		onClick)
	addListener('mousedown',	mouseDown)
	addListener('mouseup',		mouseUp)
	addListener('mousemove',	mouseMove)
	addListener('touchstart',	onTouch)
	addListener('touchmove',	onTouch)
	addListener("touchend",		onTouch);
	addListener("touchcancel",	onTouch);

	return input;
}