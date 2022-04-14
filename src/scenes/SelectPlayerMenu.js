class SelectPlayerMenu extends Menu {
    constructor() {
        super({
            key: "selectPlayerScene"
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
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'ROCKET PATROL', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2, 'Use Mouse to Move & Left-Click to Fire', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = '#000';
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Press [1] for Single-Player or [2] for Two-Player', menuConfig).setOrigin(0.5);

        
        // define keys
        key1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        key2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(key1)) {
            // single player
            game.settings.isOnePlayer = true;
            this.sound.play('sfx_select');
            this.scene.start('selectDiffScene');
        }
        if (Phaser.Input.Keyboard.JustDown(key2)) {
            // two player
            game.settings.isOnePlayer = false;
            this.sound.play('sfx_select');
            this.scene.start('selectDiffScene');
        }
    }
}