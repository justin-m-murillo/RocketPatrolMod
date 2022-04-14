// Cannon asset dimensions: 16x32

class Cannon extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        
        scene.add.existing(this); // add object to existing. displayList, updateList
        this.isCharging = false;
        this.isFiring = false;
        this.ptrDownTime = 0; // time pointer was held down to charge
        this.timeThresh = 600; // amount of time (ms) to reach full charge
        //this.maxCharge = 4; // max speed boost from charge
        //this.moveSpeed = 2; // default firing speed
        //this.maxSpeed = 6; // max firing speed
        //this.sfxRocket = scene.sound.add('sfx_rocket'); // add rocket sfx
    }

    // Move Rocket
    aimCannon(PtrX) { this.x = PtrX; }
}