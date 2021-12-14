async function setPlayerPoints(playerId: string, points: number){
    await db.run("UPDATE players SET points = ? WHERE id = ?", [points, playerId]);
}