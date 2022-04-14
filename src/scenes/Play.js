//const { Phaser } = require("../../lib/phaser");

class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket-new.png');
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

    update() {

        // GAME CONTROL /////////////////////////////////////////////////////////////////////////
        
        // Update time remaining in game
        this.timeRight.setText("Time: " + this.playTimer.getRemainingSeconds().toFixed(1));
        
        // if game over and player chooses to restart game
        if (this.gameOver)
            this.scene.start("gameOverScene");

        // while timer has not expired, 
        // spawn enemy ships and move starfield backdrop
        if (!this.gameOver) {
            this.starfield.tilePositionX -= 4; // moving starfield backdrop
            this.ship01.update(); // update spaceship (x3)
            this.ship02.update();
            this.ship03.update();
        }

        //////////////////////////////////////////////////////////////////////////////////////////

        // ACTIVE POINTER CONTROLS ///////////////////////////////////////////////////////////////

        // Move Rocket
        if (!this.p1Rocket.isFiring)
            if (this.input.activePointer.x <= game.config.width - borderUISize - borderPadding &&
                this.input.activePointer.x >= borderUISize + borderPadding)
                    this.p1Rocket.aimRocket(this.input.activePointer.x);
        
        // Move Cannon
        if (this.input.activePointer.x <= game.config.width - borderUISize - borderPadding &&
            this.input.activePointer.x >= borderUISize + borderPadding)
                this.p1Cannon.aimCannon(this.input.activePointer.x);
                    
            
        // Charge Rocket
        if (this.input.activePointer.isDown && !this.p1Rocket.isFiring) 
            this.p1Rocket.chargeRocket(this.input.activePointer.downTime);
        
        // Release Charge, Fire Rocket, Reset Charge Flag
        if (!this.input.activePointer.isDown && this.p1Rocket.isCharging) 
            this.p1Rocket.fireRocket(this.time.now);
        
        // When Fired, Move Rocket Up
        if(this.p1Rocket.isFiring && this.p1Rocket.y >= borderUISize * 3 + borderPadding)
            this.p1Rocket.moveUpRocket();

        // Reset Rocket On Miss
        if(this.p1Rocket.y <= borderUISize * 3 + borderPadding)
            this.p1Rocket.reset();

        //////////////////////////////////////////////////////////////////////////////////////////

        // CHECK COLLISIONS ////////////////////////////////////////////////////////////////////// 
        
        if (this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset(this.p1Cannon.x);
            this.shipExplode(this.ship03);
            this.playTimer.delay += 1000; // add time for successful hit
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset(this.p1Cannon.x);
            this.shipExplode(this.ship02);
            this.playTimer.delay += 1000; // add time for successful hit
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset(this.p1Cannon.x);
            this.shipExplode(this.ship01);
            this.playTimer.delay += 1000; // add time for successful hit
        }
    }

    // method to check collision between rocket and ships
    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
                return true;
        } else {
            return false;
        }
    }

    // method to execute collision effects
    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode'); // play explode animation
        boom.on('animationcomplete', () => { // callback after anim completes
            ship.reset(); // reset ship position
            ship.alpha = 1; // make ship visible again
            boom.destroy(); // remove explosion sprite
        });
        // score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        // execute explosion audio
        this.sound.play('sfx_explosion');
    }
}