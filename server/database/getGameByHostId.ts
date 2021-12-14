async function getGameByHostId(hostId: string){
    return await db.get("SELECT * FROM games WHERE host = ?", [hostId]);
}