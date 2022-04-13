// const { Phaser } = require("../../lib/phaser");

// Spaceship prefab
class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this); // add to existing scene
        this.points = pointValue; // store pointValue
        this.moveSpeed = game.settings.spaceshipSpeed; // pixels per frame
    }

    update() {
        this.x -= this.moveSpeed; // move spaceship left
        
        if(this.x <= 0 - this.width) { 
            this.x = game.config.width; // wrap around from left edge to right edge
        }
    }

    reset() {
        this.x = game.config.width; // position reset
    }
}