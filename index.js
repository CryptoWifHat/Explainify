const express = require('express');
const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');

const app = express();
const port = process.env.PORT || 3000;

app.get('/api/explainify', async (req, res) => {
  const { text, age } = req.query;

  try {
    const response = await fetch('https://explainify.onrender.com/index.html')
      .then(res => res.text());

    const result = await executeScriptInHTML(response, text, age);

    res.status(200).json({ message: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function executeScriptInHTML(html, text, age) {
  const dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });

  return new Promise((resolve, reject) => {
    dom.window.document.addEventListener('DOMContentLoaded', async () => {
      try {
        const result = await dom.window.askPuter(text, age);
        resolve(result);
      } catch (error) {
        reject(error.message);
      }
    });
  });
}

app.listen(port, () => {
  console.log(`Server läuft auf Port ${port}`);
});
