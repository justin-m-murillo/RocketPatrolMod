/*

Justin Murillo
Rocket Patrol Mod
04/15/2022
Completion Time: > 10 hours

ROCKET PATROL MODIFICATIONS

1.) Updated weapon asset and mechanics (20 pts)
    a.) Weapon is now a cannon that shoots a rocket
    b.) Revised rocket asset to be circular
    c.) Implemented a charging mechanic for the rocket. Longer charges increase the speed of the projectile. 
2.) For single player, implemented mouse controls and removed keyboard controls for the cannon only. (20 pts)
3.) Implemented add-time bonus (1 sec.) for every successful hit on enemy spaceships. (20 pts)
4.) Added a countdown timer display on the top-right corner of the Play scene. Displays time remaining in game. (10 pts)
5.) Implemented simultaneous two-player mode (30 pts)

POINTS

    1 (20)
    2 (20)
    3 (20)
    4 (10)
    5 (30)
    ------
Total 100


WORKS CITED

https://photonstorm.github.io/phaser3-docs/ - Referenced document for all code

*/

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
    gameTimer: 0,
    chosePlayer: false,
    choseDiff: false
}

let keyA, keyD, keySPACE, keyR, keyM, keyLEFT, keyRIGHT, key1, key2, key0;

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// Rocket Reset Y Position
const posResetY = game.config.height - borderUISize - borderPadding - 12;