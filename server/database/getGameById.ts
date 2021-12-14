async function getGameById(gameId: number){
    return await db.get("SELECT * FROM games WHERE id = ?", [gameId]);
}