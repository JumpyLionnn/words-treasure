async function doesWordExist(word: string){
    return (await db.get("SELECT * FROM words WHERE word = ?", word)) !== undefined;
}