async function getAllPlayersByGameId(gameId: number) {
    return await db.all("SELECT * FROM players WHERE gameId = ?", [gameId]);
}