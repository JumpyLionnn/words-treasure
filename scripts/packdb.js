const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
const sqlite = require("sqlite");


async function main() {
    const db = await sqlite.open({
        filename: "D:/projects/word-game/server/database.db",
        driver: sqlite3.Database
    });

    let csv = "";

    await db.each("SELECT * FROM words ORDER BY MatchingWords ASC;", [], (err, result) => {
        csv += `${result.MatchingWords},${result.id}\n`;
        console.log(result.word);
    });

    fs.writeFileSync("words.csv", csv);
}


main();