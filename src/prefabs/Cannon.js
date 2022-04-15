// Cannon asset dimensions: 16x32

class Cannon extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        
        scene.add.existing(this); // add object to existing. displayList, updateList
        this.name = '';
        this.isCharging = false;
        this.isFiring = false;
        this.ptrDownTime = 0; // time pointer was held down to charge
        this.timeThresh = 600; // amount of time (ms) to reach full charge
        this.moveSpeed = 2; // default moving speed
        //this.maxCharge = 4; // max speed boost from charge
        //this.maxSpeed = 6; // max firing speed
        //this.sfxRocket = scene.sound.add('sfx_rocket'); // add rocket sfx
    }
    
    // Set Name
    setName(name) { this.name = name; }

    // Move Rocket
    aimCannon(PtrX) { this.x = PtrX; }
}