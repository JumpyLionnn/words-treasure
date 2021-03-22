const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
const sqlite = require("sqlite");


async function load() {
    const db = await sqlite.open({
        filename: "./database.db",
        driver: sqlite3.Database
    });

    await db.run("CREATE TABLE IF NOT EXISTS words(id INTEGER PRIMARY KEY, word VARCHAR(40));")
    await db.run("CREATE TABLE IF NOT EXISTS diff(id INTEGER PRIMARY KEY, word VARCHAR(40), diff VARCHAR(8));")

    const data = JSON.parse(fs.readFileSync("./words.json"));
    for (let i = 0; i < data.words.length; i++) {
        console.log(data.words[i]);
        await db.run(`INSERT INTO words(word) VALUES ('${data.words[i]}')`);
        if (data.words[i].length > 8) {
            await db.run(`INSERT INTO diff(word, diff) VALUES ('${data.words[i]}', 'easy')`);
        } else if (data.words[i].length < 8 && data.words[i].length > 5) {
            await db.run(`INSERT INTO diff(word, diff) VALUES ('${data.words[i]}', 'normal')`);
        } else if (data.words[i].length < 6 && data.words[i].length > 2) {
            await db.run(`INSERT INTO diff(word, diff) VALUES ('${data.words[i]}', 'hard')`);
        }
    }
}


load()