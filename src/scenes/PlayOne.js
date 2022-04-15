// single player mode class
class PlayOne extends Play {
    constructor() {
        super('playOneScene');

        this.playTimer = Phaser.Time.TimerEvent;
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
        // score game object
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig); 
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
        this.viewedTime = this.time.delayedCall(game.settings.gameTimer, () => {
            this.scene.start("gameOverScene"); // when time is up, move to game over scene
        });                          
        // time object    
        this.timeRight = this.add.text(game.config.width - borderUISize - borderPadding*17.5, borderUISize + borderPadding*2, 
                                       "Time: " + this.viewedTime.getRemainingSeconds().toFixed(1), timeConfig);
        // GAME OVER flag
        this.gameOver = false;
        // 60-second play clock
        scoreConfig.fixedWidth = 0;

        // player objects & charge timer
        this.p1Rocket = new Rocket(this, game.config.width/2, posResetY, 'rocketP1').setOrigin(0.5, 0.5); 
        this.p1Rocket.setName('p1Rocket');
        this.p1Cannon = new Cannon(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'cannon').setOrigin(0.5, 0.7);
        this.p1Cannon.setName('p1Cannon');
    }

    update() {
        // GAME CONTROL ///////////////////////////////////////////////////////////////////////// 
        // time object    
        this.timeRight.setText("Time: " + this.viewedTime.getRemainingSeconds().toFixed(1));
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
        if (this.input.activePointer.isDown && !this.p1Rocket.isFiring) {
            this.p1Rocket.isCharging = true;
            this.p1Rocket.chargeRocket(this.input.activePointer.downTime);
        }
        
        // Release Charge, Fire Rocket, Reset Charge Flag
        if (!this.input.activePointer.isDown && this.p1Rocket.isCharging) 
            this.p1Rocket.fireRocket(this.time.now);
        
        // When Fired, Move Rocket Up
        if(this.p1Rocket.isFiring && this.p1Rocket.y >= borderUISize * 3 + borderPadding)
            this.p1Rocket.moveUpRocket();

        // Reset Rocket On Miss
        if(this.p1Rocket.y <= borderUISize * 3 + borderPadding)
            this.p1Rocket.reset(this.p1Cannon.x);

        //////////////////////////////////////////////////////////////////////////////////////////

        // CHECK COLLISIONS ////////////////////////////////////////////////////////////////////// 
        
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