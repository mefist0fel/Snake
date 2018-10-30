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
    canvas.font = "16pt Arial"
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
        canvas.fillText("FPS:", width - 120, 50)
        canvas.textAlign = "end";
        canvas.fillText(parseInt(fps), width - 30, 50)
    }
}

function renderSelectLevelState() {
    camera.render()
    // info
    canvas.fillStyle = '#FFFFFF'
    canvas.textAlign = "center"; // "start", "end", "center", "left", "right"
    canvas.fillText("Level: " + levelId , width * 0.5, height * 0.5 - minSize * 0.46)
    canvas.fillText("need apples: " + level.applesNeed , width * 0.5, height * 0.5 - minSize * 0.42)
    canvas.fillText("rocks on level: " + level.needRocks , width * 0.5, height * 0.5 - minSize * 0.38)
    canvas.fillText("<< to select level >>", width * 0.5, height * 0.5 + minSize * 0.4)
    canvas.fillText("space to start", width * 0.5, height * 0.5 + minSize * 0.45)
}

function renderWinState() {
    camera.render()
    // info
    canvas.fillStyle = '#FFFFFF'
    canvas.textAlign = "center"; // "start", "end", "center", "left", "right"
    canvas.fillText("YOU WIN!", width * 0.5, height * 0.5 - minSize * 0.4)
    canvas.fillText("space to next level", width * 0.5, height * 0.5 + minSize * 0.4)
    canvas.fillText("esc to level selection", width * 0.5, height * 0.5 + minSize * 0.45)
}

function renderLoseState() {
    camera.render()
    // info
    canvas.fillStyle = '#FFFFFF'
    canvas.textAlign = "center"; // "start", "end", "center", "left", "right"
    canvas.fillText("YOU LOSE!", width * 0.5, height * 0.5 - minSize * 0.4)
    canvas.fillText("space to retry", width * 0.5, height * 0.5 + minSize * 0.4)
    canvas.fillText("esc to level selection", width * 0.5, height * 0.5 + minSize * 0.45)
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
    canvas.fillText("Apples: " + level.applesCount + "/" + level.applesNeed, width * 0.5 - minSize * 0.5, height * 0.5 - minSize * 0.45)
    canvas.fillText("lives: " + level.livesCount, width * 0.5 - minSize * 0.5, height * 0.5 - minSize * 0.4)
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
            camera.cameraPosition = CreateVector3((1 - anim * anim) * 30.0 * changeLevelDirection, 0.0, 15.0)
        } else {
            if (level.id != levelId) {
                level.setLevel(levelId)
            }
            camera.cameraPosition = CreateVector3((-1 + anim * anim) * 30.0 * changeLevelDirection, 0.0, 15.0)
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
    level.update(dt)
}

function updatePauseState(dt) {
    if (input.key[27]) { // esc
        input.key[27] = false
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
    let rotateAngle = 0
    if (input.key[65] || input.key[37]) { // LEFT | A
        rotateAngle = 1.0
    }
    if (input.key[68] || input.key[39]) { // RIGHT | D
        rotateAngle = -1.0
    }
    if (input.mouseLeft) {
        if (inRect(input.mousePosition[0], input.mousePosition[1], 0.0, height * 0.5, width * 0.3, height * 1.0)) {
            rotateAngle = 1.0 // left
        }
        if (inRect(input.mousePosition[0], input.mousePosition[1], width * 0.7, height * 0.5, width * 1.0, height * 1.0)) {
            rotateAngle = -1.0 // right
        }
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
    let YNVector = NormalizeVector2([cameraVector[1], Math.sqrt(cameraVector[0], cameraVector[2])])
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
}