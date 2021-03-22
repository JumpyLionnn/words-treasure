async function disconnect(socketId: string, db: any) {

    await db.run("DELETE FROM playersWords WHERE playerId = ?", [socketId]);

    let player = await db.get("SELECT * FROM players WHERE id = ?", [socketId]);
    if(player){
        await db.run("DELETE FROM players WHERE id = ?", [socketId]);
        io.sockets.socket(socketId).leave(player.gameId);

        let players = await db.all("SELECT * FROM players WHERE gameId = ?", [player.gameId]);
        if(players.length === 0){
            await db.run("DELETE FROM games WHERE id = ?", [player.gameId]);
        }
    }
    
}