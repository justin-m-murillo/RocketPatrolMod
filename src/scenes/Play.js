//const { Phaser } = require("../../lib/phaser");

class Play extends Phaser.Scene {
    constructor(key) {
        super(key);
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocketP1', './assets/rocketP1.png');
        this.load.image('rocketP2', './assets/rocketP2.png');
        this.load.image('cannon', './assets/cannon.png');
        this.load.image('cannonP1', './assets/cannonP1.png')
        this.load.image('cannonP2', './assets/cannonP2.png')
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        
        let canvas = this.sys.canvas;
        canvas.style.cursor = 'none'; // Hide cursor while in play scene
    }

    // method to check collision between rocket and ships
    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && rocket.x + rocket.width > ship.x && rocket.y < ship.y + ship.height && rocket.height + rocket.y > ship.y) 
            return true;
        else 
            return false;
    }

    countdown(newTime) {
        this.time.removeEvent(this.viewedTime);
        this.viewedTime = this.time.delayedCall(newTime, () => {
            this.scene.start("gameOverScene"); // when time is up, move to game over scene
        });  
    }
}