import phaser from '../../../phaser/src/phaser.js';
import PerlinGrivatyWellPlugin from '../../plugins/perlingrivatywell-plugin.js';

class Demo extends Phaser.Scene {
    constructor() {
        super({
            key: 'examples'
        })
        this.clock;
        this.text;
    }

    preload() {
        this.load.atlas('flares', 'assets/images/particles/flares/flares.png', 'assets/images/particles/flares/flares.json');
    }

    create() {
        var emitter = this.add.particles(0, 0, 'flares', {
            speed: 300,
            lifespan: 1000,
            scale: 0.1,
            quantity: 5
        });

        var perlinGrivatyWell = this.plugins.get('rexPerlinGrivatyWell').add();
        emitter.addParticleProcessor(perlinGrivatyWell);

        this.input.on('pointermove', function (pointer) {            
            emitter.particleX = pointer.x;
            emitter.particleY = pointer.y;
        })
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
        global: [
            {
                key: 'rexPerlinGrivatyWell',
                plugin: PerlinGrivatyWellPlugin,
                start: true
            }
        ]
    }
};

var game = new Phaser.Game(config);