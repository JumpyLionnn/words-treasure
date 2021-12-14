async function countWords(word: string, gameId: number){
    return (await db.get("SELECT COUNT(*) AS count FROM playersWords WHERE word = ? AND gameId = ?", [word, gameId])).count;
}