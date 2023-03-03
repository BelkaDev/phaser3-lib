import phaser from 'phaser/src/phaser.js';
import TrianglePlugin from '../../plugins/triangle-plugin.js';

class Demo extends Phaser.Scene {
    constructor() {
        super({
            key: 'examples'
        })
    }

    preload() { }

    create() {
        var print = this.add.text(0, 0, '');
        var triangle = this.add.rexTriangle(400, 300, 100, 100, 0x888888)
            .setPadding(10)
            .setDirection('up')

        var graphics = this.add.graphics({
            lineStyle: {
                width: 1, color: 0xff0000, alpha: 1
            }
        })
            .strokeRectShape(triangle.getBounds())

        this.input.on('pointerdown', function () {
            triangle.direction++;
            print.text = `Direction=${triangle.direction}`;
        })
        print.text = `Direction=${triangle.direction}`;

    }

    update() { }
}

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: Demo,
    plugins: {
        global: [{
            key: 'rexTriangle',
            plugin: TrianglePlugin,
            start: true
        }]
    }
};

var game = new Phaser.Game(config);