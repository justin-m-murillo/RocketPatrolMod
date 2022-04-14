// Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        
        scene.add.existing(this); // add object to existing. displayList, updateList
        this.isCharging = false;
        this.isFiring = false;
        this.ptrDownTime = 0; // time pointer was held down to charge
        this.maxCharge = 4; // max speed boost from charge
        this.timeThresh = 600; // amount of time (ms) to reach full charge
        this.moveSpeed = 2; // default firing speed
        this.maxSpeed = 6; // max firing speed

        this.sfxRocket = scene.sound.add('sfx_rocket'); // add rocket sfx
        //this.posResetY = game.config.height - borderUISize - borderPadding - 20; 
    }

    // Move Rocket
    aimRocket(PtrX) { this.x = PtrX; }
    
    // Charge Rocket
    chargeRocket(dT) { this.ptrDownTime = dT; this.isCharging = true; }

    // Release Charge, Fire Rocket, Reset Charge Flag
    fireRocket(sT) {
        this.isCharging = false;
        this.isFiring = true;
        this.chargeDur = (sT - this.ptrDownTime);
        //console.log("Charge Duration = " + this.chargeDur);
    }

    // When Fired, Move Rocket Up
    moveUpRocket() {
        let velocity = this.moveSpeed + this.maxCharge * (this.chargeDur/this.timeThresh);
        let vf = velocity < this.maxSpeed ? velocity : this.maxSpeed;
        this.y -= vf;
        //console.log('Velocity = ' + vf);
    }

    // reset rocket to "ground"
    reset(x) {
        this.isFiring = false;
        this.chargeDur = 0;
        this.x = x;
        this.y = posResetY;
    }
}