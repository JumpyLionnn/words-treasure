async function setGameState(gameId:number, gameState: string){
    await db.run("UPDATE games SET state = ? WHERE id = ?",[gameState, gameId]);
}