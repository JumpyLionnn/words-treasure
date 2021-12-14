async function addWordToPlayer(playerId: string, gameId: number, word: string){
    await db.run("INSERT INTO playersWords(playerId, gameId, word) VALUES (?, ?, ?)", [playerId, gameId, word]);
}