async function addGameToDatabase(code: string, hostId: string, duration: number, difficulty: string, maxPlayers: number, word: string){
    return await db.get(`INSERT INTO games(code, state, host, duration, difficulty, maxPlayers, word) VALUES
        (?, 'waiting', ?, ?, ?, ?, ?);`,
        [code, hostId, duration, difficulty, maxPlayers, word]);
}