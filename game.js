import { preload } from './scenes/preload.js';
import { create } from './scenes/create.js';
import { update } from './scenes/update.js';

export let game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 900,
    height: 512,
    parent: 'game',
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 600 },
            debug: false,
        },
    },
    scene: {
        preload,
        create,
        update,
    },
});
