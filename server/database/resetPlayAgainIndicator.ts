async function resetPlayersPlayAgainIndicatorByGameId(gameId: number) {
    await db.run("UPDATE players SET playAgain = 0 WHERE gameId = ?", [gameId]);
}