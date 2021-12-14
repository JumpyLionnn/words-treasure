async function setGameAsStarted(gameId: number){
    await db.run("UPDATE games SET state = 'started', startTime = ? WHERE id = ?", [Math.floor(Date.now() / 1000), gameId]);
}