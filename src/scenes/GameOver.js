
class GameOver extends Phaser.Scene {
    constructor() {
        super("gameOverScene");
    }

    create() {
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);

        let gameOverConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }

        this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', gameOverConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or (M) for Menu', gameOverConfig).setOrigin(0.5);
    }

    update() {
        // if game over and player chooses to restart game
        if (Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.start("playScene");
        }
        // if game over and player chooses to go back to main menu
        if (Phaser.Input.Keyboard.JustDown(keyM)) {
            this.scene.start("menuScene");
        }
    }
}