async function disconnect(socketId: string, db: any) {

    await db.run("DELETE FROM playersWords WHERE playerId = ?", [socketId]);

    let player = await db.get("SELECT * FROM players WHERE id = ?", [socketId]);
    if(player){

        

        await db.run("DELETE FROM players WHERE id = ?", [socketId]);
        if(io.sockets.sockets[socketId]){
            io.sockets.sockets[socketId].leave(player.gameId);
        }

        let players = await db.all("SELECT * FROM players WHERE gameId = ?", [player.gameId]);
        if(players.length === 0){
            await db.run("DELETE FROM games WHERE id = ?", [player.gameId]);
        }
        else{
            let game = await db.get("SELECT * FROM games WHERE id = ?", [player.gameId]);
            if(game.host === socketId){
                await db.run("UPDATE games SET host = ? WHERE id = ?", [players[0].id, game.id])
            }
            console.log("playerLeft")
            io.to(player.gameId).emit("playerLeft", {name: player.name, host: players[0].name});
        }
    }
    
}