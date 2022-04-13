let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play, GameOver ]
}

let game = new Phaser.Game(config);

// reserve keyboard vars
let keyF, keyR, keyM, keyLEFT, keyRIGHT;

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

