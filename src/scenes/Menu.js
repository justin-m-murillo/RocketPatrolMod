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
            fontSize: '18px',
            backgroundColor: '#F3B141',
            color: '#000',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        this.gameTitle = this.add.text(game.config.width/2, game.config.height/3 - borderPadding, 'ROCKET PATROL', menuConfig).setOrigin(0.5);
        this.desc1 = this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, '', menuConfig).setOrigin(0.5);
        this.desc2 = this.add.text(game.config.width/2, game.config.height/2, 'Select A Game Mode', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = '#000';
        this.options1 = this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, '', menuConfig).setOrigin(0.5);
        this.options2 = this.add.text(game.config.width/2, game.config.height/2 + 2*(borderUISize + borderPadding), '', menuConfig).setOrigin(0.5);
        this.options1.setText('Press [1] for Single-Player or [2] for Two-Player');
        // define keys
        key1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        key2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
    }

    update() {
        if (!this.chosePlayer && Phaser.Input.Keyboard.JustDown(key1)) {
            this.chosePlayer = true;
            this.desc1.setBackgroundColor('#C73E3E').setColor('#FFF');
            this.desc2.setBackgroundColor('#C73E3E').setColor('#FFF');
            this.desc1.setText('Use Mouse to Move & Left-Click to Fire');
            this.desc2.setText('Hold Down Left-Click to Charge Shot');
            game.settings.playerMode = 'playOneScene';
        }
        if (!this.chosePlayer && Phaser.Input.Keyboard.JustDown(key2)) {
            this.chosePlayer = true;
            this.desc1.setBackgroundColor('#C73E3E').setColor('#FFF');
            this.desc2.setBackgroundColor('#C73E3E').setColor('#FFF');
            this.desc1.setText('Player 1: [A] Move Left, [D] Move Right, [W] Shoot');
            this.desc2.setText('Player 2: LEFT Move Left, RIGHT Move Right, Num0 Shoot');
            game.settings.playerMode = 'playTwoScene';
        }    
        if (this.chosePlayer && game.settings.playerMode == 'playTwoScene' && !this.choseDiff) {
            this.options1.setBackgroundColor('#C73E3E').setColor('#FFF');
            this.options1.setText('Hold Down Firing Button to Charge Shot');
            this.options2.setText('Press [1] for Novice or [2] for Expert');
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
        if (this.chosePlayer && game.settings.playerMode == 'playOneScene' && !this.choseDiff) {
            this.options1.setText('Press [1] for Novice or [2] for Expert');
            //this.options2.setText('Press [1] for Novice or [2] for Expert');
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
        if (this.choseDiff) {
            this.chosePlayer = false;
            this.choseDiff = false;
            this.scene.start(game.settings.playerMode);
        }
            
    }
}