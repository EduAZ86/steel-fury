export class GameState {
    private _score = 0;
    private _isGameOver = false;

    public get score(): number {
        return this._score;
    }

    public get isGameOver(): boolean {
        return this._isGameOver;
    }

    public addScore(damage: number) {
        this._score += damage;
    }

    public checkGameOver(playerHealth: number, baseDestroyed: boolean = false) {
        if (playerHealth <= 0 || baseDestroyed) {
            this._isGameOver = true;
        }
    }

    public reset() {
        this._score = 0;
        this._isGameOver = false;
    }
}
