async function removePlayAgainMark(playerId: string){
    await db.run("UPDATE players SET playAgain = 0 WHERE id = ?", [playerId]);
}