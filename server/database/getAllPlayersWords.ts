async function getAllPlayersWords(playerId: string){
    return await db.all("SELECT word FROM playersWords WHERE playerId = ?",[playerId]);
}