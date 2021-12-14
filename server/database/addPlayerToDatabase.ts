async function addPlayerToDatabase(socketId: string, gameId: number, name: string){
    await db.run(`INSERT INTO players(id, gameId, name) VALUES (?, ?, ?)`, [socketId, gameId, name]);
}