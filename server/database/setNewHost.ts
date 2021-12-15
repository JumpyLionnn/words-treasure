async function setNewHost(gameId: number, newHostId: string){
    await db.run("UPDATE games SET host = ? WHERE id = ?", [newHostId, gameId]);
}