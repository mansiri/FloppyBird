import { game } from '../game.js'; // j'ai du importer l'instance de mon jeu ici pour l'utiliser dans le create.js

// Ou j'initialise mes variables
let character, base, baseImage, baseHeight, baseWidth;
let score = 0;
let scoreText;
let isGameOver = false;
let isRefresh = false;
let hitPlayed = false;
let diePlayed = false;
let gameStart = false;
let point, hit, wing, die;
let speed = -150;
let spawnTime = 1500;

export function create() {
    //on initiallis le jeu ici    
     // initialisation de la scene
    let background = this.add.tileSprite(0, 0, game.config.width, game.config.height, "background");
    background.setOrigin(0, 0);
    background.displayWidth = game.config.width;
    background.displayHeight = game.config.height;

    // initialisation du plancher 
    baseImage = this.textures.get("base");
    baseHeight = baseImage.getSourceImage().height;
    baseWidth = baseImage.getSourceImage().width;
    base = this.add.tileSprite(game.config.width / 2, game.config.height - baseHeight / 2, baseWidth, baseHeight, "base");
    base.displayWidth = game.config.width;
    this.physics.add.existing(base, true);
    base.setDepth(1);

    let startGameImage = this.add.image(game.config.width / 2, game.config.height / 3, "startGame");
    startGameImage.setOrigin(0.5, 0.5);

    //initialisation du personnage
    character = this.physics.add.sprite(game.config.width / 4, game.config.height / 2, "character1");
    character.setDepth(1);
    character.setCollideWorldBounds(true);
    character.body.allowGravity = false;


    //Creation des deux poteaux dans un groupe
    this.upperPillars = this.physics.add.group();
    this.lowerPillars = this.physics.add.group();


    //Creation de l'animation de l'oiseau
    this.anims.create({
        key: "fly",
        frames: [{ key: "character1" }, { key: "character2" }, { key: "character3" }],
        frameRate: 9,
        repeat: -1,
    });

    
    this.anims.create({
        key: "fall",
        frames: [{ key: "character2" }],
        frameRate: 9,
        repeat: -1,
    });

    //animation de l'oiseau
    character.anims.play("fly", true);

    this.pillarTimer = this.time.addEvent({
        delay: spawnTime,
        callback: spawnPillarPair,
        callbackScope: this,
        loop: true,
        paused: true
    });


    this.input.on("pointerdown", () => {
        //Quand on clique sur l'ecran, on fait sauter le personnage
        if (!gameStart) {
            gameStart = true;
            startGameImage.setVisible(false);
            character.body.allowGravity = true;
            spawnPillarPair.call(this);
            this.pillarTimer.paused = false;
            this.physics.add.collider(character, this.upperPillars, hitPillar, null, this);
            this.physics.add.collider(character, this.lowerPillars, hitPillar, null, this);
            this.physics.add.collider(character, base, hitBase, null, this);

            scoreText = this.add.text(game.config.width / 2, 30, "0", {
                fontSize: "32px",
                fontFamily: "Fantasy",
                fill: "white",
            }).setOrigin(0.5).setDepth(1);

            point = this.sound.add("score");
            hit = this.sound.add("hit");
            wing = this.sound.add("wing");
            die = this.sound.add("die");
        } else if (!isRefresh && !isGameOver) {
            wing.play();
            character.setVelocityY(-230);
        }

        isRefresh = false;
    });

    document.getElementById("retry-button").style.display = "none";

    document.getElementById("retry-button").addEventListener("click", () => {
        isGameOver = false;
        score = 0;
        gameStart = false;
        hitPlayed = false;
        diePlayed = false;
        isRefresh = true;
        document.getElementById("retry-button").style.display = "none";
        this.scene.restart();
    });
}

function spawnPillarPair() {
    //Apparition des deux poteaux
    baseImage = this.textures.get("base");
    baseHeight = baseImage.getSourceImage().height;
    let pillarImage = this.textures.get("pillar");
    let pillarHeight = pillarImage.getSourceImage().height;

    let Offset = ((Math.random() * pillarHeight) / 2) * (Math.floor(Math.random() * 3) - 1);
    let gapHeight = (1 / 3) * (game.config.height - baseHeight);

    let lowerY = 2 * gapHeight + pillarHeight / 2 + Offset;
    let upperY = gapHeight - pillarHeight / 2 + Offset;

    let upperPillar = this.upperPillars.create(game.config.width, upperY, "pillar");
    let lowerPillar = this.lowerPillars.create(game.config.width, lowerY, "pillar");

    upperPillar.setAngle(180);
    upperPillar.body.allowGravity = false;
    lowerPillar.body.allowGravity = false;

    upperPillar.setVelocityX(speed);
    lowerPillar.setVelocityX(speed);
}

function hitBase(character, base) {
    // fonction qui gere le personnage et le plancher
    if (!hitPlayed) hit.play();
    character.anims.play("fall", true);
    base.body.enable = false;
    character.setVelocity(0);
    character.body.allowGravity = false;

    stopAllPillars.call(this);

    isGameOver = true;
    if (this.pillarTimer) this.pillarTimer.paused = true;

    showGameOverUI.call(this);
}

function hitPillar(character, pillar) {
    // fonction qui gere le personnage et les poteaux
    if (!hitPlayed && !diePlayed) {
        hit.play();
        die.play();
        hitPlayed = true;
        diePlayed = true;
    }
    character.anims.play("fall", true);
    pillar.body.enable = false;
    character.setVelocityX(0);

    stopAllPillars.call(this);

    isGameOver = true;
    if (this.pillarTimer) this.pillarTimer.paused = true;

    showGameOverUI.call(this);
}

function stopAllPillars() {
    [this.upperPillars, this.lowerPillars].forEach(group =>
        group.children.iterate(pillar => pillar.body.velocity.x = 0)
    );
}

function showGameOverUI() {
    let gameOverImage = this.add.image(game.config.width / 2, game.config.height / 4, "gameover");
    gameOverImage.setOrigin(0.5);
    gameOverImage.setDepth(2);

    if (scoreText) scoreText.destroy();

    const retryButton = document.getElementById("retry-button");
    retryButton.style.display = "block";
}
