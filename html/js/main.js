
const minDt = 1/30
let fps,
    time = timestamp()

let width = document.documentElement.clientWidth
let height = document.documentElement.clientHeight
let minSize = Math.min(width, height)
const selectLevelState = 0
const pauseState = 1
const gameState = 3
const startGameState = 4
const winState = 5
const loseState = 6
let state = selectLevelState

// init
let input = Input()
let canvasElement = document.getElementById('snake')
let canvas = canvasElement.getContext('2d')
let camera = new Camera(canvas)
SetCanvasSize(width, height)
let changeLevelAnim = 0
let changeLevelDirection = 1.0
let levelId = 0

let currentMatrix = CreateUnitMatrix3()
let rotationAxe = NormalizeVector3(CreateVector3(1.0, 1.0, 1.0))

let level = new Level()

let needShowDebugInfo = false
let needShowFPSInfo = false

function timestamp() {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime()
}

function render() {
    // clear
    canvas.fillStyle = '#000011'
    canvas.fillRect ( 0, 0, width, height)
    switch(state) {
        default:
        case selectLevelState:
            renderSelectLevelState()
            break
        case pauseState:
            renderPauseState()
            break
        case startGameState:
            renderStartGameState()
            break
        case gameState:
            renderGameState()
            break
        case winState:
            renderWinState()
            break
        case loseState:
            renderLoseState()
            break
    }
    // debug
    if (needShowFPSInfo) {
        canvas.textAlign = "end";
        canvas.fillText("FPS: " + Math.round(fps), width - 30, 50)
    }
}

function renderSelectLevelState() {
    camera.render()
    // info
    canvas.fillStyle = '#FFFFFF'
    canvas.textAlign = "center"; // "start", "end", "center", "left", "right"
    canvas.fillText("Level: " + (levelId + 1) , width * 0.5, height * 0.25 - minSize * 0.17)
    canvas.fillText("need apples: " + level.applesNeed , width * 0.5, height * 0.25 - minSize * 0.1)
    canvas.fillText("rocks on level: " + level.needRocks , width * 0.5, height * 0.25 - minSize * 0.03)
    drawEntranceIcon(width * 0.5, height - minSize * 0.1, minSize * 0.1)
    drawArrowLeft(minSize * 0.1, height - minSize * 0.1, minSize * 0.1)
    drawArrowRight(width - minSize * 0.1, height - minSize * 0.1, minSize * 0.1)
}

function drawEntranceIcon(x, y, size) {
    canvas.fillStyle = '#FFFFFF33'
    canvas.strokeStyle = '#FFFFFF11'
    
    canvas.beginPath()
    canvas.arc(x + size * 0.2, y, size * 0.6, Math.PI * 0.75, Math.PI * 1.25, true)
    canvas.arc(x + size * 0.2, y, size * 0.4, Math.PI * 1.25, Math.PI * 0.75)
    canvas.closePath()
    canvas.fill()
    canvas.stroke()
    canvas.beginPath()
    canvas.moveTo(x, y)
    canvas.lineTo(x - size * 0.4, y + size * 0.4)
    canvas.lineTo(x - size * 0.4, y + size * 0.12)
    canvas.lineTo(x - size * 0.76, y + size * 0.12)
    canvas.lineTo(x - size * 0.76, y - size * 0.12)
    canvas.lineTo(x - size * 0.4, y - size * 0.12)
    canvas.lineTo(x - size * 0.4, y - size * 0.4)
    canvas.closePath()
    canvas.fill()
    canvas.stroke()
}

function drawExitIcon(x, y, size) {
    canvas.fillStyle = '#FFFFFF33'
    canvas.strokeStyle = '#FFFFFF11'

    canvas.beginPath()
    canvas.arc(x + size * 0.2, y, size * 0.5, Math.PI * 0.838, Math.PI * 1.162, true)
    canvas.arc(x + size * 0.2, y, size * 0.3, Math.PI * 1.3, Math.PI * 0.7)
    canvas.closePath()
    canvas.fill()
    canvas.stroke()
    canvas.beginPath()
    canvas.moveTo(x + size * 0.04 - size * 0.8, y)
    canvas.lineTo(x + size * 0.04 - size * 0.4, y + size * 0.4)
    canvas.lineTo(x + size * 0.04 - size * 0.4, y + size * 0.12)
    canvas.lineTo(x + size * 0.04 - size * 0.04, y + size * 0.12)
    canvas.lineTo(x + size * 0.04 - size * 0.04, y - size * 0.12)
    canvas.lineTo(x + size * 0.04 - size * 0.4, y - size * 0.12)
    canvas.lineTo(x + size * 0.04 - size * 0.4, y - size * 0.4)
    canvas.closePath()
    canvas.fill()
    canvas.stroke()
}

function drawRestartIcon(x, y, size) {
    canvas.fillStyle = '#FFFFFF33'
    canvas.strokeStyle = '#FFFFFF11'
    
    canvas.beginPath()
    canvas.arc(x, y, size * 0.6, Math.PI * 0.5, Math.PI * 0.2)
    canvas.arc(x, y, size * 0.4, Math.PI * 0.2, Math.PI * 0.5, true)
    canvas.lineTo(x, y + size * 0.3)
    canvas.lineTo(x + size * 0.3, y + size * 0.5)
    canvas.lineTo(x, y + size * 0.7)
    canvas.closePath()
    canvas.fill()
    canvas.stroke()
}

function drawArrowRight(x, y, size) {
    canvas.fillStyle = '#FFFFFF33'
    canvas.strokeStyle = '#FFFFFF11'
    canvas.beginPath()
    canvas.moveTo(x + size * 0.5, y)
    canvas.lineTo(x, y + size * 0.5)
    canvas.lineTo(x - size * 0.5, y + size * 0.5)
    canvas.lineTo(x, y)
    canvas.lineTo(x - size * 0.5, y - size * 0.5)
    canvas.lineTo(x, y - size * 0.5)
    canvas.closePath()
    canvas.fill()
    canvas.stroke()
}

function drawArrowLeft(x, y, size) {
    canvas.fillStyle = '#FFFFFF33'
    canvas.strokeStyle = '#FFFFFF11'
    canvas.beginPath()
    canvas.moveTo(x - size * 0.5, y)
    canvas.lineTo(x, y + size * 0.5)
    canvas.lineTo(x + size * 0.5, y + size * 0.5)
    canvas.lineTo(x, y)
    canvas.lineTo(x + size * 0.5, y - size * 0.5)
    canvas.lineTo(x, y - size * 0.5)
    canvas.closePath()
    canvas.fill()
    canvas.stroke()
}

function drawMenuIcon(x, y, size) {
    canvas.fillStyle = '#FFFFFF33'
    canvas.strokeStyle = '#FFFFFF11'
    canvas.rect(x - size * 0.5, y + size * 0.3, size, size * 0.2)
    canvas.rect(x - size * 0.5, y - size * 0.1, size, size * 0.2)
    canvas.rect(x - size * 0.5, y - size * 0.5, size, size * 0.2)
    canvas.fill()
    canvas.stroke()
}

function renderWinState() {
    camera.render()
    // info
    canvas.fillStyle = '#FFFFFF'
    canvas.textAlign = "center"; // "start", "end", "center", "left", "right"
    canvas.fillText("YOU WIN!", width * 0.5, height * 0.1)
    //canvas.fillText("space to next level", width * 0.5, height * 0.85)
    //canvas.fillText("esc to level selection", width * 0.5, height * 0.95)
    drawExitIcon(minSize * 0.13, height - minSize * 0.1, minSize * 0.12)
    drawArrowRight(width - minSize * 0.1, height - minSize * 0.1, minSize * 0.1)
}

function renderLoseState() {
    camera.render()
    // info
    canvas.fillStyle = '#FFFFFF'
    canvas.textAlign = "center"; // "start", "end", "center", "left", "right"
    canvas.fillText("YOU LOSE!", width * 0.5, height * 0.1)
    drawExitIcon(minSize * 0.13, height - minSize * 0.1, minSize * 0.12)
    drawRestartIcon(width - minSize * 0.1, height - minSize * 0.1, minSize * 0.1)
}

function renderPauseState() {
    camera.render()
    // info
    canvas.fillStyle = '#FFFFFF'  // white
    canvas.textAlign = "center"; // "start", "end", "center", "left", "right"
    canvas.fillText("PAUSE ", width * 0.5, height * 0.5 - minSize * 0.4)
    canvas.fillText("Q to quit ", width * 0.5, height * 0.5 + minSize * 0.4)
    canvas.fillText("Esc to continue ", width * 0.5, height * 0.5 + minSize * 0.45)
}

function renderStartGameState() {
    camera.render()
    let alpha = parseInt((Math.max(0.0, 1.0 - Math.abs(changeLevelAnim * 3.0 - 1.5))) * 255.0)
    canvas.fillStyle = rgbToHex(0, 0, 0, alpha)
    canvas.fillRect ( 0, 0, width, height)
}

function renderGameState() {
    camera.render()
    // info
    canvas.fillStyle = '#FFFFFF'  // white
    canvas.textAlign = "start"; // "end", "center", "left", "right"
    canvas.textBaseline = "middle"; // textBaseline = "top" || "hanging" || "middle" || "alphabetic" || "ideographic" || "bottom";
    canvas.fillText(level.applesCount + "/" + level.applesNeed, minSize * 0.15, minSize * 0.1)
    drawApple(minSize * 0.1, minSize * 0.1, minSize * 0.046)
    for(let i = 0; i < level.livesCount; i++) {
        drawLiveHeart(width * 0.5 + (i - 1) * minSize * 0.05, height - minSize * 0.1, minSize * 0.05)
    }
    drawMenuIcon(width - minSize * 0.1, minSize * 0.1, minSize * 0.08)
    drawArrowLeft(minSize * 0.1, height - minSize * 0.1, minSize * 0.1)
    drawArrowRight(width - minSize * 0.1, height - minSize * 0.1, minSize * 0.1)
}

function drawLiveHeart(x, y, size = 10.0) {
    canvas.fillStyle = '#FF0000'
    canvas.beginPath()
    canvas.moveTo(x, y + size * 0.5);
    canvas.arc(x - size * 0.175, y, size * 0.25, Math.PI * 0.75, Math.PI * 1.75);
    canvas.arc(x + size * 0.175, y, size * 0.25, Math.PI * 1.25, Math.PI * 2.25);
    canvas.closePath()
    canvas.fill()
}

function drawApple(x, y, size = 10.0) {
    canvas.fillStyle = '#33FF33'
    canvas.beginPath()
    canvas.arc(x, y, size * 0.5, 0.0, Math.PI * 2.0);
    canvas.closePath()
    canvas.fill()
}

function update(dt) {
    switch(state) {
        default:
        case selectLevelState:
            updateSelectLevelState(dt)
            break
        case startGameState:
            updateStartGameState(dt)
            break
        case pauseState:
            updatePauseState(dt)
            break
        case gameState:
            updateGameState(dt)
            break
        case winState:
            updateWinState(dt)
            break
        case loseState:
            updateLoseState(dt)
            break
    }
    if (input.key[115]) { // F4
        input.key[115] = false
        needShowFPSInfo = !needShowFPSInfo
        console.log(Camera.instance.objects.length)
    }
}

function updateSelectLevelState(dt) {
    if (changeLevelAnim > 0) {
        const changeSpeed = 3.0
        changeLevelAnim -= changeSpeed * dt
        if (changeLevelAnim < 0)
            changeLevelAnim = 0
        let anim = (changeLevelAnim - 0.5) * 2.0
        if (anim > 0) {
            camera.cameraPosition = CreateVector3((1 - anim * anim) * 30.0 * changeLevelDirection, 0.0, 20.0)
        } else {
            if (level.id != levelId) {
                level.setLevel(levelId)
            }
            camera.cameraPosition = CreateVector3((-1 + anim * anim) * 30.0 * changeLevelDirection, 0.0, 20.0)
        }
        return
    }
    if (input.key[32]) { // space
        input.key[32] = false
        setState(startGameState)
    }
    if (input.key[65] || input.key[37]) { // LEFT | A
        if (levelId > 0) {
            changeLevelAnim = 1.0
            changeLevelDirection = -1.0
            levelId -= 1
        }
    }
    if (input.key[68] || input.key[39]) { // RIGHT | D
        changeLevelAnim = 1.0
        changeLevelDirection = 1.0
        levelId += 1
    }
    if (input.isTouchRect(0, height * 0.5, width * 0.3, height)) {
        if (levelId > 0) {
            changeLevelAnim = 1.0
            changeLevelDirection = -1.0
            levelId -= 1
        }
    }
    if (input.isTouchRect(width * 0.7, height * 0.5, width, height)) {
        changeLevelAnim = 1.0
        changeLevelDirection = 1.0
        levelId += 1
    }
    if (input.isTouchRect(width * 0.4, height * 0.5, width * 0.6, height)) {
        setState(startGameState)
    }
    level.update(dt)
    currentMatrix = MultiplyMatrix3(currentMatrix, CreateRotationMatrix3(rotationAxe, 20.0 * dt))
    rotationAxe = NormalizeVector3(
        CreateVector3(
            rotationAxe[0] * 100.0 + (Math.random() * 2.0 - 1),
            rotationAxe[1] * 100.0 + (Math.random() * 2.0 - 1),
            rotationAxe[2] * 100.0 + (Math.random() * 2.0 - 1)))
    camera.worldMatrix = currentMatrix
    camera.position = MultiplyVector3(camera.position, 1.0 - 1.0 * dt)

    if (input.key[113]) { // F2
        input.key[113] = false
        needShowDebugInfo = !needShowDebugInfo
        level.showDebugInfo(needShowDebugInfo)
    }
}

function updateWinState(dt) {
    if (changeLevelAnim > 0) {
        const changeSpeed = 3.0
        changeLevelAnim -= changeSpeed * dt
        if (changeLevelAnim < 0) {
            changeLevelAnim = 0
        }
        let anim = (changeLevelAnim - 0.5) * 2.0
        if (anim > 0) {
            camera.cameraPosition = CreateVector3((1 - anim * anim) * 30.0 * changeLevelDirection, 0.0, 15.0)
        } else {
            if (level.id != levelId) {
                level.setLevel(levelId)
            }
            camera.cameraPosition = CreateVector3((-1 + anim * anim) * 30.0 * changeLevelDirection, 0.0, 15.0)
        }
        return
    }
    if (level.id == levelId) {
        setState(startGameState)
        return
    }
    if (input.key[27]) { // esc
        input.key[27] = false
        levelId -= 1
        setState(selectLevelState)
    }
    if (input.key[32]) { // space
        input.key[32] = false
        changeLevelAnim = 1.0
        changeLevelDirection = 1.0
    }
    if (input.key[65] || input.key[37]) { // LEFT | A
        input.key[65] = false
        input.key[37] = false

        levelId -= 1
        setState(selectLevelState)
    }
    if (input.key[68] || input.key[39]) { // RIGHT | D
        input.key[68] = false
        input.key[39] = false

        changeLevelAnim = 1.0
        changeLevelDirection = 1.0
    }
    if (input.isTouchRect(0, height * 0.5, width * 0.3, height)) { // bottom left screen space touch
        levelId -= 1
        setState(selectLevelState)
    }
    if (input.isTouchRect(width * 0.7, 0, width, height)) { // top right screen space touch
        changeLevelAnim = 1.0
        changeLevelDirection = 1.0
    }
    level.update(dt)
}

function updateStartGameState(dt) {
    if (changeLevelAnim > 0) {
        const changeSpeed = 1.0
        let next = changeLevelAnim - changeSpeed * dt
        if (next <= 0.5 && changeLevelAnim > 0.5) {
            level.setLevel(levelId)
        }
        changeLevelAnim = next
        if (changeLevelAnim < 0)
            changeLevelAnim = 0
        if (changeLevelAnim < 0.5) {
            level.update(dt)
            camera.position = level.snake.position
            let angles = getCameraRotation(level.snake.position)
            camera.worldMatrix = MultiplyMatrix3(CreateRotationMatrix3(CreateVector3(1.0), angles[0]), CreateRotationMatrix3(CreateVector3(0.0, 1.0), angles[1]))
        }
    } else {
        setState(gameState)
    }
}

function updateLoseState(dt) {
    if (input.key[27]) { // esc
        input.key[27] = false
        setState(selectLevelState)
    }
    if (input.key[32]) { // space
        input.key[32] = false
        setState(startGameState)
    }
    if (input.key[65] || input.key[37]) { // LEFT | A
        input.key[65] = false
        input.key[37] = false
        setState(selectLevelState)
    }
    if (input.key[68] || input.key[39]) { // RIGHT | D
        input.key[68] = false
        input.key[39] = false
        setState(startGameState)
    }
    if (input.isTouchRect(0, height * 0.5, width * 0.3, height)) { // bottom left screen space touch
        setState(selectLevelState)
    }
    if (input.isTouchRect(width * 0.7, 0, width, height)) { // top left screen space touch
        setState(selectLevelState)
    }
    level.update(dt)
}

function updatePauseState(dt) {
    if (input.key[27]) { // esc
        input.key[27] = false
        setState(gameState)
    }
    if (input.isTouchRect(width * 0.7, 0, width, height * 0.3)) { // top right screen space touch
        setState(gameState)
    }
    if (input.key[81]) { // Q
        input.key[81] = false
        setState(selectLevelState)
    }
}

function updateGameState(dt) {
    // control
    // UP = 38
    // DOWN = 40
    // LEFT = 37
    // RIGHT = 39
    // W = 87
    // S = 83
    // A = 65
    // D = 68
    // space = 32
    if (input.key[27]) { // esc
        input.key[27] = false
        setState(pauseState)
    }
    if (input.isTouchRect(width * 0.7, 0, width, height * 0.3)) { // top right screen space touch
        setState(pauseState)
    }
    let rotateAngle = 0
    if (input.key[65] || input.key[37]) { // LEFT | A
        rotateAngle = 1.0
    }
    if (input.key[68] || input.key[39]) { // RIGHT | D
        rotateAngle = -1.0
    }
    if (input.isTouchRect(0, 0, width * 0.5, height)) {
        rotateAngle = 1.0 // left
    }
    if (input.isTouchRect(width * 0.5, 0, width, height)) {
        rotateAngle = -1.0 // right
    }
    level.snake.rotate(rotateAngle)
    level.snake.update(dt)

    level.update(dt)

    camera.position = level.snake.position
    let angles = getCameraRotation(level.snake.position)
    camera.worldMatrix = MultiplyMatrix3(CreateRotationMatrix3(CreateVector3(1.0), angles[0]), CreateRotationMatrix3(CreateVector3(0.0, 1.0), angles[1]))
    if (input.key[113]) { // F2
        input.key[113] = false
        needShowDebugInfo = !needShowDebugInfo
        level.showDebugInfo(needShowDebugInfo)
    }
    if (level.applesNeed <= level.applesCount) {
        setState(winState)
    }
    if (level.livesCount <= 0) {
        setState(loseState)
    }
}

function getCameraRotation(position) {
    let cameraVector = NormalizeVector3(position)
    let XZVector = NormalizeVector2([cameraVector[0], cameraVector[2]])
    // let YNVector = NormalizeVector2([cameraVector[1], Math.sqrt(cameraVector[0], cameraVector[2])])
    let baseAngle = Math.acos(XZVector[0]) / Math.PI * 180.0
    let upAngle = Math.acos(cameraVector[1]) / Math.PI * 180.0 - 90.0
    if (cameraVector[2] > 0) {
        baseAngle += 90.0
    } else {
        baseAngle = 90.0 - baseAngle
    }
    return [upAngle, baseAngle]
}

function setState(newState) {
    state = newState
	input.clearKeys()
    switch(state) {
        default:
        case selectLevelState:
            currentMatrix = camera.worldMatrix
            level.hideLevelDetails()
            break
        case startGameState:
            changeLevelAnim = 1.0
            break
        case pauseState:
            break
        case gameState:
            for(let i = 0; i < 30; i++) {
                level.snake.update(1.0/30.0)
            }
            level.start()
            break
        case winState:
            level.hideLevelDetails()
            levelId += 1
            break
        case loseState:
            level.hideLevelDetails()
            break
    }
}

function frame() {
    let now = timestamp()
    let delta = (now - time) / 1000.0
    fps = 1.0 / delta
    if (delta > minDt) {
        delta = minDt
    }
    update(delta)
    render()
    time = now
    requestAnimationFrame(frame)
    if (width != document.documentElement.clientWidth || height != document.documentElement.clientHeight) {
        width = document.documentElement.clientWidth
        height = document.documentElement.clientHeight
        minSize = Math.min(width, height)
        SetCanvasSize(width, height)
    }
}
requestAnimationFrame(frame)

function SetCanvasSize(width, height) {
    canvasElement.width = width
    canvasElement.height = height

    camera.setSize(width, height)

    let fontSize = 32.0
    if (height > width) {
        fontSize *= height / width
    }
    canvas.font = parseInt(fontSize) + "pt Arial"
}
