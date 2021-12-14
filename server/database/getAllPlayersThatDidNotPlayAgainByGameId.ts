async function deleteAllPlayersThatDidNotPlayAgainByGameId(gameId: number){
    const result = await db.all("SELECT * FROM players WHERE gameId = ? AND playAgain = 0;", [gameId]);
    await db.all("DELETE FROM players WHERE gameId = ? AND playAgain = 0;", [gameId]);
    return result;
}