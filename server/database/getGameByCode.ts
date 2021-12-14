async function getGameByCode(code: string){
    return await db.get(`SELECT * FROM games WHERE code = ?`, [code]);
}