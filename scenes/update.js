export function update() {
    if (!this.character || !this.base || !this.upperPillars || !this.lowerPillars) return;

    if (!this.isGameOver) this.base.tilePositionX += 1;

    if (!this.gameStart) return;

    let scoreIncremented = false;

    [this.upperPillars, this.lowerPillars].forEach((group) => {
        group.children.iterate((pillar) => {
            if (!pillar) return;

            if (!pillar.hasPassed && pillar.x + pillar.width < this.character.x) {
                pillar.hasPassed = true;
                if (!scoreIncremented) {
                    this.score++;
                    this.scoreText.setText(this.score);
                    this.point.play();
                    scoreIncremented = true;
                }
            }

            if (pillar.x + pillar.width < 0) {
                pillar.destroy();
            }
        });
    });
}
