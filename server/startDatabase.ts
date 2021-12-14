async function startDatabase() {
    db = await sqlite.open({
        filename: "./server/database.db",
        driver: sqlite3.Database
    });
    
    await db.get(`CREATE TABLE IF NOT EXISTS games(
        id INTEGER PRIMARY KEY,
        code TEXT,
        state TEXT,
        host TEXT,
        duration INTEGER,
        difficulty TEXT,
        maxPlayers INTEGER,
        startTime INTEGER,
        word TEXT
    )`);

    await db.run(`CREATE TABLE IF NOT EXISTS players(
        id TEXT,
        gameId INTEGER,
        name VARCHAR(10),
        points INTEGER DEFAULT 0,
        playAgain INTEGER
    )`);

    await db.run(`CREATE TABLE IF NOT EXISTS playersWords(
        playerId TEXT,
        gameId INTEGER,
        word VARCHAR(40)
    )`);

    await db.run("DELETE FROM games");
    await db.run("DELETE FROM players");
    await db.run("DELETE FROM playersWords");
    console.log("connected to the database");
}