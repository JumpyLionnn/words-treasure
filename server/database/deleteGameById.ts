async function deleteGameById(gameId: number){
    await db.run("DELETE FROM games WHERE id = ?", [gameId]);
}