async function isThePlayerInAGame(socketId: string) {
    return (await db.get("SELECT * FROM players WHERE id = ?", [socketId])) !== undefined;
}