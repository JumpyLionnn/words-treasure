const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
const sqlite = require("sqlite");


async function load() {
    const db = await sqlite.open({
        filename: "D:/projects/word-game/server/database.db",
        driver: sqlite3.Database
    });

    await db.run("CREATE TABLE IF NOT EXISTS words(id INTEGER PRIMARY KEY, word VARCHAR(40), MatchingWords INTEGER, definition TEXT);")

    const data = JSON.parse(fs.readFileSync("D:/projects/word-game/scripts/wordsWithDefinitions.json"));
    for (let wordToCheck in data) {
        if (!isWordValid(wordToCheck)) {
            delete data[wordToCheck];
        }
    }
    for (let word in data) {
        let matchTimes = 0;
        for (let wordToCheck in data) {
            if (checkMatchingWord(wordToCheck, word)) {
                matchTimes++;
            }
        }
        console.log(word + ": " + matchTimes);


        await db.run(`INSERT INTO words(word, MatchingWords, definition) VALUES (?, ?, ?)`, [word, matchTimes, data[word]]);
    }
}

function checkMatchingWord(word, matchingWord) {
    let remainingLetters = matchingWord.split("");
    for (let i = 0; i < word.length; i++) {
        if (remainingLetters.includes(word[i])) {
            remainingLetters.splice(remainingLetters.indexOf(word[i]), 1);
        } else {
            return false;
        }
    }
    return true;
}

function isWordValid(word) {
    if (/[^a-z]/.test(word)) {
        return false;
    }
    if (word.length === 1 && !(word === "a" || word === "i")) {
        return false;
    }
    return true;
}




load()