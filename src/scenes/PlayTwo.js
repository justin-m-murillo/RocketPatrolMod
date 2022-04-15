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
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        key0 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_ZERO);

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
        // Score board for player 1 and player 2
        scoreConfig.backgroundColor = "#bb2438";
        scoreConfig.color = "#fff"
        this.p1ScoreDis = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, 
                                       this.p1Score, scoreConfig);
        scoreConfig.backgroundColor = "#1f74ad";
        this.p2ScoreDis = this.add.text(borderUISize + borderPadding*16, borderUISize + borderPadding*2, 
                                       this.p2Score, scoreConfig);
        // game objects
        this.p1Rocket = new Rocket(this, game.config.width/4, posResetY, 'rocketP1').setOrigin(0.5, 0.5);
        this.p1Rocket.setName('p1Rocket');
        this.p2Rocket = new Rocket(this, 3*(game.config.width)/4, posResetY, 'rocketP2').setOrigin(0.5, 0.5);
        this.p2Rocket.setName('p2Rocket');
        this.p1Cannon = new Cannon(this, game.config.width/4, game.config.height - borderUISize - borderPadding, 'cannonP1').setOrigin(0.5, 0.7);
        this.p1Cannon.setName('p1Cannon');
        this.p2Cannon = new Cannon(this, 3*(game.config.width)/4, game.config.height - borderUISize - borderPadding, 'cannonP2').setOrigin(0.5, 0.7);
        this.p2Cannon.setName('p2Cannon');
        // firing charge timer
        this.p1CannonDownTime = 0; // p1 charging time
        this.p2CannonDownTime = 0; // p2 charging time
        this.timeDown1 = 0;
        this.timeUp1 = 0;
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
        
        // PLAYER ONE /////////////////////////////////////////////////////////////////////////////

        // Move p1Rocket
        if (!this.p1Rocket.isFiring) {
            // move right
            if (this.p1Rocket.x <= game.config.width - borderUISize - borderPadding && keyD.isDown) { 
                //this.p1Rocket.x >= borderUISize + borderPadding)
                this.p1Rocket.x += this.p1Rocket.moveSpeed;
            }
            // move left
            if (this.p1Rocket.x >= borderUISize + borderPadding && keyA.isDown) {
                this.p1Rocket.x -= this.p1Rocket.moveSpeed;
            }
        }

        // Move p1Cannon
            // move right
        if (this.p1Cannon.x <= game.config.width - borderUISize - borderPadding && keyD.isDown) { 
            this.p1Cannon.x += this.p1Cannon.moveSpeed;
        }
            // move left
        if (this.p1Cannon.x >= borderUISize + borderPadding && keyA.isDown) {
            this.p1Cannon.x -= this.p1Cannon.moveSpeed;
        }

        // Charge Rocket
        if (keySPACE.isDown && !this.p1Rocket.isFiring) {
            this.p1Rocket.chargeRocket(keySPACE.timeDown);
        }
        
        // Release Charge, Fire Rocket, Reset Charge Flag
        if (!keySPACE.isDown && this.p1Rocket.isCharging) {
            this.p1Rocket.fireRocket(this.time.now);
        }

        // When Fired, Move Rocket Up
        if (this.p1Rocket.isFiring && this.p1Rocket.y >= borderUISize * 3 + borderPadding)
            this.p1Rocket.moveUpRocket();

        // Reset Rocket On Miss
        if(this.p1Rocket.y <= borderUISize * 3 + borderPadding)
            this.p1Rocket.reset(this.p1Cannon.x);

        //////////////////////////////////////////////////////////////////////////////////////////

        // PLAYER TWO /////////////////////////////////////////////////////////////////////////////

        // Move p2Rocket
        if (!this.p2Rocket.isFiring) {
            // move right
            if (this.p2Rocket.x <= game.config.width - borderUISize - borderPadding && keyRIGHT.isDown) { 
                //this.p1Rocket.x >= borderUISize + borderPadding)
                this.p2Rocket.x += this.p2Rocket.moveSpeed;
            }
            // move left
            if (this.p2Rocket.x >= borderUISize + borderPadding && keyLEFT.isDown) {
                this.p2Rocket.x -= this.p2Rocket.moveSpeed;
            }
        }

        // Move p2Cannon
            // move right
        if (this.p2Cannon.x <= game.config.width - borderUISize - borderPadding && keyRIGHT.isDown) { 
            this.p2Cannon.x += this.p2Cannon.moveSpeed;
        }
            // move left
        if (this.p2Cannon.x >= borderUISize + borderPadding && keyLEFT.isDown) {
            this.p2Cannon.x -= this.p2Cannon.moveSpeed;
        }

        // Charge Rocket
        this.p2CannonDownTime = key0.duration; // p1 charging time
        if (key0.isDown && !this.p2Rocket.isFiring) {
            this.p2Rocket.chargeRocket(key0.timeDown);
            //this.p1Rocket.chargeRocket();
        }
        
        // Release Charge, Fire Rocket, Reset Charge Flag
        if (!key0.isDown && this.p2Rocket.isCharging) {
            this.p2Rocket.isCharging = false;
            this.p2Rocket.isFiring = true;
            this.p2Rocket.fireRocket(this.time.now);
        }

        // When Fired, Move Rocket Up
        if (this.p2Rocket.isFiring && this.p2Rocket.y >= borderUISize * 3 + borderPadding)
            this.p2Rocket.moveUpRocket();

        // Reset Rocket On Miss
        if (this.p2Rocket.y <= borderUISize * 3 + borderPadding)
            this.p2Rocket.reset(this.p2Cannon.x);

        //////////////////////////////////////////////////////////////////////////////////////////

        // CHECK COLLISIONS ////////////////////////////////////////////////////////////////////// 
        
        // P1 Rocket Collision
        if (this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset(this.p1Cannon.x);
            this.shipExplode(this.p1Rocket, this.ship03);
            this.countdown((this.viewedTime.getRemainingSeconds() + 1) * 1000); // add time for successful hit
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset(this.p1Cannon.x);
            this.shipExplode(this.p1Rocket, this.ship02);
            this.countdown((this.viewedTime.getRemainingSeconds() + 1) * 1000); // add time for successful hit
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset(this.p1Cannon.x);
            this.shipExplode(this.p1Rocket, this.ship01);
            this.countdown((this.viewedTime.getRemainingSeconds() + 1) * 1000); // add time for successful hit
        }

        // P2 Rocket Collision
        if (this.checkCollision(this.p2Rocket, this.ship03)) {
            this.p2Rocket.reset(this.p2Cannon.x);
            this.shipExplode(this.p2Rocket, this.ship03);
            this.countdown((this.viewedTime.getRemainingSeconds() + 1) * 1000); // add time for successful hit
        }
        if (this.checkCollision(this.p2Rocket, this.ship02)) {
            this.p2Rocket.reset(this.p2Cannon.x);
            this.shipExplode(this.p2Rocket, this.ship02);
            this.countdown((this.viewedTime.getRemainingSeconds() + 1) * 1000); // add time for successful hit
        }
        if (this.checkCollision(this.p2Rocket, this.ship01)) {
            this.p2Rocket.reset(this.p2Cannon.x);
            this.shipExplode(this.p2Rocket, this.ship01);
            this.countdown((this.viewedTime.getRemainingSeconds() + 1) * 1000); // add time for successful hit
        }
    }

    // method to execute collision effects
    shipExplode(rocket, ship) {
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
        switch (rocket.name) {
            case 'p1Rocket':
                this.p1Score += ship.points;
                this.p1ScoreDis.text = this.p1Score;
                break;
            case 'p2Rocket':
                this.p2Score += ship.points;
                this.p2ScoreDis.text = this.p2Score;
                break;
            default:
                console.log('ERROR: POINTS UNREGISTERED');
                this.scene.start('menuScene');
        }
        // execute explosion audio
        this.sound.play('sfx_explosion');
    }
}