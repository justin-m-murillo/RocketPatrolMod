// Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        
        scene.add.existing(this); // add object to existing. displayList, updateList
        this.isCharging = false;
        this.isFiring = false;
        this.chargeDur = 0; // duration the firing button was held down
        this.maxCharge = 4; // max speed boost from charge
        this.timeThresh = 800; // amount of time (ms) to reach full charge
        this.moveSpeed = 2; // default firing speed
        this.maxSpeed = 6; // max firing speed
        this.sfxRocket = scene.sound.add('sfx_rocket'); // add rocket sfx
        
    }

    move(ptrX) { this.x = ptrX; }

    update() {

        // left/right movement
        // if(!this.isFiring) {
        //      if(this.mouse.x >= borderUISize + this.width && 
        //         this.mouse.x <= game.config.width - borderUISize - this.width) 
        //         this.x = this.mouse.x;
        // }
        
        // // charging shot
        

        // if(this.mouse.isDown && !this.isFiring) {
        //     this.isCharging = true;
        //     this.chargeDur = this.mouse.getDuration();
        //     console.log("Time Held (s) = " + this.chargeDur/1000);
        //     //this.sfxRocket.play(); // play sfx rocket
        // }

        // // on release of charge, fire and reset charge 
        // if (this.mouse.isUp && this.isCharging) {
        //     this.isCharging = false;
        //     this.isFiring = true;
        // }

        // // if fired, move up
        // if(this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
        //     let velocity = this.moveSpeed + this.maxCharge * (this.chargeDur/this.timeThresh);
        //     let vf = velocity < this.maxSpeed ? velocity : this.maxSpeed;
        //     console.log("Velocity = " + vf);
        //     this.y -= vf;
        // }

        // // reset on miss
        // if(this.y <= borderUISize * 3 + borderPadding) {
        //     this.reset();
        // }
    }

    // reset rocket to "ground"
    reset() {
        this.isFiring = false;
        this.chargeDur = 0;
        this.y = game.config.height - borderUISize - borderPadding;
    }
}