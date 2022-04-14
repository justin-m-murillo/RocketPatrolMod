// const { Phaser } = require("../../lib/phaser");

class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene');

        this.chosePlayer = false;
        this.choseDiff = false;
        this.gameTitle = Phaser.GameObjects.Text;
        this.controls = Phaser.GameObjects.Text;
        this.options = Phaser.GameObjects.Text;
    }

    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/assets_blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/assets_explosion38.wav');
        this.load.audio('sfx_rocket', './assets/assets_rocket_shot.wav');
    }

    create() {
        // menu text config
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '20px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        this.gameTitle = this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding,
                                       'ROCKET PATROL', menuConfig).setOrigin(0.5);
        this.controls = this.add.text(game.config.width/2, game.config.height/2, 
                                      'Use Mouse to Move & Left-Click to Fire', menuConfig).setOrigin(0.5);
        
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = '#000';
        this.options = this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, '', menuConfig).setOrigin(0.5);
        this.options.setText('Press [1] for Single-Player or [2] for Two-Player');
        // define keys
        key1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        key2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
        
    }

    update() {
        if (!this.chosePlayer && Phaser.Input.Keyboard.JustDown(key1)) {
            this.chosePlayer = true;
            game.settings.isOnePlayer = true;
        }
        if (!this.chosePlayer && Phaser.Input.Keyboard.JustDown(key2)) {
            this.chosePlayer = true;
            game.settings.isOnePlayer = false;
        }    
        if (this.chosePlayer && !this.choseDiff) {
            this.options.setText('Press [1] for Novice or [2] for Expert');
            if (Phaser.Input.Keyboard.JustDown(key1)) {
                game.settings.spaceshipSpeed = 3;
                game.settings.gameTimer = 60000;
                this.choseDiff = true;
            }
            if (Phaser.Input.Keyboard.JustDown(key2)) {
                game.settings.spaceshipSpeed = 4;
                game.settings.gameTimer = 45000;
                this.choseDiff = true;
            }
        }
        if (this.choseDiff)
            this.configureGame();
    }

    configureGame() {
        switch (game.settings.isOnePlayer) {
            case true: this.scene.start('playOneScene'); break;
            case false: this.scene.start('playTwoScene'); break;
            default : this.scene.start('menuScene');
        }
    }
}