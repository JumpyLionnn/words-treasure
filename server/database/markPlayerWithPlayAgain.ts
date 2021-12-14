async function markPlayerWithPlayAgain(playerId: string){
    await db.run("UPDATE players SET playAgain = 1 WHERE id = ?", [playerId]);
}