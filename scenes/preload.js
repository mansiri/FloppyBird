export function preload() {
    //Voila oou j'ai preset  tout les assets de mon jeu 
    this.load.image("background", "assets/GameObjects/city.png");
    this.load.image("character1", "assets/GameObjects/yellowbird-midflap.png");
    this.load.image("character2", "assets/GameObjects/yellowbird-downflap.png");
    this.load.image("character3", "assets/GameObjects/yellowbird-upflap.png");
    this.load.image("pillar", "assets/GameObjects/pipe-green.png");
    this.load.image("base", "assets/GameObjects/base.png");
    this.load.image("gameover", "assets/UI/gameover.png");
    this.load.image("startGame", "assets/UI/message.png");
    this.load.audio("score", "assets/SoundEffects/point.wav");
    this.load.audio("hit", "assets/SoundEffects/hit.wav");
    this.load.audio("wing", "assets/SoundEffects/wing.wav");
    this.load.audio("die", "assets/SoundEffects/die.wav");
}
