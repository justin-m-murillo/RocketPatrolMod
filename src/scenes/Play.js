//const { Phaser } = require("../../lib/phaser");

class Play extends Phaser.Scene {
    constructor(key) {
        super(key);
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket-new2.png');
        this.load.image('cannon', './assets/cannon.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        
        let canvas = this.sys.canvas;
        canvas.style.cursor = 'none'; // Hide cursor while in play scene
    }

    create() {
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.p1Rocket = new Rocket(this, game.config.width/2, posResetY, 'rocket').setOrigin(0.5, 0.5);
        this.p1Cannon = new Cannon(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'cannon').setOrigin(0.5, 0.7);
        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0, 0);        
        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        // firing charge timer
        this.ptrDownTime = 0;
        // track remaining game time, initialize with max given time
        this.gameTime = game.settings.gameTimer;
        // initialize score
        this.p1Score = 0;
        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        // display score
        let timeConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 175
        }
        // score game object
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, 
                                       this.p1Score, scoreConfig);
        // play countdown timer
        this.playTimer = this.time.addEvent({
            delay: game.settings.gameTimer,
            paused: false
        });                               
        
        this.timeRight = this.add.text(game.config.width - borderUISize - borderPadding*17.5, borderUISize + borderPadding*2, 
                                       "Time: " + this.playTimer, timeConfig);
        // GAME OVER flag
        this.gameOver = false;
        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.gameOver = true;
        }, null, this);
    }

    // method to check collision between rocket and ships
    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) 
        {
            return true;
        } 
        else 
        {
            return false;
        }
    }
}