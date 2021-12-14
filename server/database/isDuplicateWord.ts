async function isDuplicateWord(word: string, playerId: string){
    return (await db.get("SELECT word FROM playersWords WHERE playerId = ? AND word = ?", [playerId, word])) !== undefined;
}