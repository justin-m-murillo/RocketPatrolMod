// const { Phaser } = require("../../lib/phaser");

class Menu extends Phaser.Scene {
    constructor(key) {
        super(key);
    }



    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/assets_blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/assets_explosion38.wav');
        this.load.audio('sfx_rocket', './assets/assets_rocket_shot.wav');
    }
}