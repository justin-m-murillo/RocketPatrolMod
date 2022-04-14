let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ 
        Menu,
        PlayOne,
        PlayTwo,
        Play,
        GameOver 
    ]
}

let game = new Phaser.Game(config);

// game settings
game.settings = {
    playerMode: '',
    spaceshipSpeed: 0,
    gameTimer: 0 
}

let keyA, keyD, keyW, keyR, keyM, keyLEFT, keyRIGHT, keyUP;

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// Rocket Reset Y Position
const posResetY = game.config.height - borderUISize - borderPadding - 12;