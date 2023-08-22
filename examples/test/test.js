import phaser from 'phaser/src/phaser.js';
import CircularProgressPlugin from '../../plugins/circularprogress-plugin.js';

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

class Demo extends Phaser.Scene {
    constructor() {
        super({
            key: 'examples'
        })
    }

    preload() { }

    create() {
        var progressBar = this.add.rexCircularProgress({
            x: 400,
            y: 300,
            radius: 60,

            barColor: 0x00ff00,
            trackColor: 0x0000ff,
            centerColor: undefined,
            thickness: 1,
            startAngle: Phaser.Math.DegToRad(270), // straight line if reduced by 4
            anticlockwise: false,

            value: 0.75,
            easeValue: {
                duration: 500,
                ease: "Linear"
            },
            valuechangeCallback: function (newValue, oldValue, circularProgress) { },
        })
            .setAlpha(0.5)

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
            key: 'rexCircularProgress',
            plugin: CircularProgressPlugin,
            start: true
        }]
    }
};

var game = new Phaser.Game(config);