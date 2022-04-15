// two player mode class
class PlayTwo extends Play {
    constructor() {
        super('playTwoScene');

    }

    create() {
        // initialize score
        this.p1Score = 0;
        this.p2Score = 0;

        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);

        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0, 0);        
        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        // initialize score
        this.p1Score = 0;
        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 125
        }
        
        // track remaining game time, initialize with max given time
        this.gameTimer = game.settings.gameTimer / 1000;
        // display time
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
        // play countdown timer
        this.viewedTime = this.time.delayedCall(60000, () => {
            this.scene.start("gameOverScene"); // when time is up, move to game over scene
        });                          
        // time object    
        this.timeRight = this.add.text(game.config.width - borderUISize - borderPadding*17.5, borderUISize + borderPadding*2, 
                                       "Time: " + this.viewedTime.getRemainingSeconds().toFixed(1), timeConfig);
        // GAME OVER flag
        this.gameOver = false;
        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        scoreConfig.backgroundColor = "#bb2438";
        scoreConfig.color = "#fff"
        this.p1ScoreDis = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, 
                                       this.p1Score, scoreConfig);
        scoreConfig.backgroundColor = "#1f74ad";
        this.p2ScoreDis = this.add.text(borderUISize + borderPadding*16, borderUISize + borderPadding*2, 
                                       this.p2Score, scoreConfig);
        // game objects
        this.p1Rocket = new Rocket(this, game.config.width/4, posResetY, 'rocketP1').setOrigin(0.5, 0.5);
        this.p2Rocket = new Rocket(this, 3*(game.config.width)/4, posResetY, 'rocketP2').setOrigin(0.5, 0.5);
        this.p1Cannon = new Cannon(this, game.config.width/4, game.config.height - borderUISize - borderPadding, 'cannonP1').setOrigin(0.5, 0.7);
        this.p2Cannon = new Cannon(this, 3*(game.config.width)/4, game.config.height - borderUISize - borderPadding, 'cannonP2').setOrigin(0.5, 0.7);
        // firing charge timer
        this.p1CannonDownTime = 0;
        this.p2CannonDownTime = 0;
    }

    update() {
        // GAME CONTROL /////////////////////////////////////////////////////////////////////////
        //Update time remaining in game
        this.timeRight.setText("Time: " + this.viewedTime.getRemainingSeconds().toFixed(1));

        if (!this.gameOver) {
            this.starfield.tilePositionX -= 4; // moving starfield backdrop
            this.ship01.update(); // update spaceship (x3)
            this.ship02.update();
            this.ship03.update();
        }

        //////////////////////////////////////////////////////////////////////////////////////////

        // ACTIVE KEYBOARD CONTROLS ///////////////////////////////////////////////////////////////
            
        // Move Rocket & Cannon
        if (!this.p1Rocket.isFiring) {
            // move right
            if (this.p1Cannon.x <= game.config.width - borderUISize - borderPadding && keyD.isDown) { 
                //this.p1Rocket.x >= borderUISize + borderPadding)
                this.p1Cannon.x += this.p1Rocket.moveSpeed;
                this.p1Rocket.x += this.p1Rocket.moveSpeed;
            }
            // move left
            if (this.p1Cannon.x >= borderUISize + borderPadding && keyA.isDown) { 
                this.p1Cannon.x -= this.p1Rocket.moveSpeed;
                this.p1Rocket.x -= this.p1Rocket.moveSpeed;
            }
        }

        this.p1CannonDownTime = keyW.duration; // p1 charging time
        if (!this.p1Rocket.isFiring && keyW.isDown) {
            this.p1Rocket.isFiring = true;
            //this.p1Rocket.chargeRocket();
        }
        if (this.p1Rocket.isFiring && this.p1CannonDownTime > 0) {
            console.log('FIRE: ' + this.p1CannonDownTime);
            this.p1Rocket.isFiring = false;
        }
        
        // Move Cannon
        // if (this.input.activePointer.x <= game.config.width - borderUISize - borderPadding &&
        //     this.input.activePointer.x >= borderUISize + borderPadding)
        //         this.p1Cannon.aimCannon(this.input.activePointer.x);
                    
            
        // Charge Rocket
        // if (this.input.activePointer.isDown && !this.p1Rocket.isFiring) 
        //     this.p1Rocket.chargeRocket(this.input.activePointer.downTime);
        
        // // Release Charge, Fire Rocket, Reset Charge Flag
        // if (!this.input.activePointer.isDown && this.p1Rocket.isCharging) 
        //     this.p1Rocket.fireRocket(this.time.now);
        
        // // When Fired, Move Rocket Up
        // if(this.p1Rocket.isFiring && this.p1Rocket.y >= borderUISize * 3 + borderPadding)
        //     this.p1Rocket.moveUpRocket();

        // // Reset Rocket On Miss
        // if(this.p1Rocket.y <= borderUISize * 3 + borderPadding)
        //     this.p1Rocket.reset();

        //////////////////////////////////////////////////////////////////////////////////////////

        // CHECK COLLISIONS ////////////////////////////////////////////////////////////////////// 
        
        // P1 Rocket Collision
        if (this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset(this.p1Cannon.x);
            this.shipExplode(this.ship03);
            this.countdown((this.viewedTime.getRemainingSeconds() + 1) * 1000) // add time for successful hit
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset(this.p1Cannon.x);
            this.shipExplode(this.ship02);
            this.countdown((this.viewedTime.getRemainingSeconds() + 1) * 1000) // add time for successful hit
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset(this.p1Cannon.x);
            this.shipExplode(this.ship01);
            this.countdown((this.viewedTime.getRemainingSeconds() + 1) * 1000) // add time for successful hit
        }

        // P2 Rocket Collision
        if (this.checkCollision(this.p2Rocket, this.ship03)) {
            this.p1Rocket.reset(this.p2Cannon.x);
            this.shipExplode(this.ship03);
            this.countdown((this.viewedTime.getRemainingSeconds() + 1) * 1000) // add time for successful hit
        }
        if (this.checkCollision(this.p2Rocket, this.ship02)) {
            this.p1Rocket.reset(this.p2Cannon.x);
            this.shipExplode(this.ship02);
            this.countdown((this.viewedTime.getRemainingSeconds() + 1) * 1000) // add time for successful hit
        }
        if (this.checkCollision(this.p2Rocket, this.ship01)) {
            this.p1Rocket.reset(this.p2Cannon.x);
            this.shipExplode(this.ship01);
            this.countdown((this.viewedTime.getRemainingSeconds() + 1) * 1000) // add time for successful hit
        }
    }
}