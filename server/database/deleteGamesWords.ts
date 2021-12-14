async function deleteGamesWords(gameId: number){
    await db.run("DELETE FROM playersWords WHERE gameId = ?", [gameId]);
}