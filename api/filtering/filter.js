const fs = require("fs");
process.env["TF_CPP_MIN_LOG_LEVEL"] = 2;
const tf = require('@tensorflow/tfjs-node');

const swearWords = fs.readFileSync(`${__dirname}/wordlist.txt`).toString().split("\n");

const tokenizerText = fs.readFileSync(`${__dirname}/tokenizer.json`).toString().replaceAll(" \\", "").replaceAll(": ", ":").replaceAll("\\", "");
const tokens = JSON.parse(tokenizerText.substring(tokenizerText.indexOf("word_index") + 13, tokenizerText.indexOf("}", tokenizerText.indexOf("word_index")) + 1));
const model = tf.loadLayersModel(`file://${__dirname}/model.json`);

function containsSwearWords(text) {
    let words = text.toLowerCase().split(" ");
    words = words.filter((word) => swearWords.includes(word));
    return words.length > 0;
}

async function containsFakeNews(text) {
    const indices = [];

    text.split(" ").forEach(word => {
        const index = tokens[word.toLowerCase().replace(/[^a-zA-Z ]/g, "")];
        if (index) indices.push(index);
    });

    while (indices.length < 1000) indices.splice(0, 0, 0);
    while (indices.length > 1000) indices.pop();

    const result = (await model).predict(tf.tensor(indices, [1, 1000])).dataSync()[0];
    return result < 0.5;
}

module.exports = {
    containsSwearWords,
    containsFakeNews
};
