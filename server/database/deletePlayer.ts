async function deletePlayer(playerId: string){
    await db.run("DELETE FROM players WHERE id = ?", [playerId]);
}