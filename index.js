require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.use(express.urlencoded({extended: false})); // This is needed to make the form work.
app.use(express.json()); // This is the body parser.

// Url storage
let shortenedUrl = [
  {
    original_url: "https://www.google.com",
    short_url: 0
  }
];

// Add url
app.post("/api/shorturl", (req,res) => {
  const body = req.body;
  const ids = shortenedUrl.map(i => i.short_url);
  const lastId = Math.max(...ids);

  if(!body.url.includes("http://")){
    if(!body.url.includes("https://")){
      return res.json({error: "Invalid URL"});
    }
  }

  const newUrl = {
    original_url: body.url,
    short_url: lastId + 1
  }

  shortenedUrl = [...shortenedUrl, newUrl];

  res.json(newUrl);
});

// Get all stored urls
app.get("/api/shorturl", (req,res) => {
  res.json(shortenedUrl);
});

// Get short link by id.
app.get("/api/shorturl/:id", (req,res) => {
  let id = Number(req.params.id);
  let url = shortenedUrl.find(u => u.short_url === id);
  console.log(url);
  res.redirect(url.original_url);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
