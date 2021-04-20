const fs = require("fs");

let css = "";

let path = "../client";

let filesNumber = 0;


console.time("in");



function walk(directory) {
    const items = fs.readdirSync(directory, { withFileTypes: true });
    for (let i = 0; i < items.length; i++) {
        if (items[i].isDirectory()) {
            walk(directory + "/" + items[i].name);
        } else if (items[i].isFile()) {
            const fileParts = items[i].name.split(".");
            if (fileParts[fileParts.length - 1] === "css" && items[i].name !== "style.min.css") {
                const file = fs.readFileSync(directory + "/" + items[i].name);
                css += file;
                filesNumber++;
            }
        }
    }
}

walk(path);

const commentsRegex = /(\/\*)[\s\S]*(\*\/)/g;
css = css.replace(commentsRegex, " ");

const selectorsRegex = /(?<=}?.*)\s+(?=.*{)/g;
css = css.replace(selectorsRegex, " ");

const propertiesRegex = /(?<=[\(\:\,{;])\s+(?=[a-z0-9\.\-#}])/g;
css = css.replace(propertiesRegex, "");

const startBracketsRegex = /(?<=})\s*/g;
const endBracketsRegex = /\s*(?={)/g;

css = css.replace(startBracketsRegex, "");

css = css.replace(endBracketsRegex, "");

fs.writeFileSync(path + "/" + 'style.min.css', css, 'utf-8');

console.log(`Successfully minified ${filesNumber} css files`);
console.timeEnd("in");