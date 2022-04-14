// two player mode class
class PlayTwo extends Play {
    constructor() {
        super('playTwoScene');
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
}