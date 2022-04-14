class SelectDiffMenu extends Menu {
    constructor() {
        super({
            key: "selectDiffScene"
        });
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
        // show menu text
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'ROCKET PATROL', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2, 'Use Mouse to Move & Left-Click to Fire', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = '#000';
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Press <- for Novice or -> for Expert', menuConfig).setOrigin(0.5);

        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            // easy mode
            game.settings.spaceshipSpeed = 3,
            game.settings.gameTimer = 60000 // <- test
            
            this.sound.play('sfx_select');
            this.startGame();
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            // hard mode
            game.settings.spaceshipSpeed = 4,
            game.settings.gameTimer = 45000 // <- test

            this.sound.play('sfx_select');
            this.startGame();
        }
    }

    startGame() {
        if (game.settings.isOnePlayer)
            this.scene.start('playOneScene');
        else
            this.scene.start('playTwoScene');
    }
}