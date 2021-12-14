async function getPlayerById(id: string){
    return await db.get("SELECT * FROM players WHERE id = ?", [id]);
}