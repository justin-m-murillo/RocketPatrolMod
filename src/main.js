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
    isOnePlayer: false,
    spaceshipSpeed: 0,
    gameTimer: 0 
}

// reserve keyboard vars
let key1, key2, keyF, keyR, keyM, keyLEFT, keyRIGHT;


// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// Rocket Reset Y Position
const posResetY = game.config.height - borderUISize - borderPadding - 12;