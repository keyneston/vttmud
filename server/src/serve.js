const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const path = require("path");
const { Client } = require('pg')

const client = new Client({query_timeout: 1000})
client.connect()

app.use(express.static(path.resolve(__dirname, "public/")));

// Handle GET requests to /api route
app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.get("/api/v1/items", (req, res) => {
  var filter = `%${req.query.filter}%` || '%'

  client.query(
  "SELECT id, name, level, cost FROM items WHERE name like $1 LIMIT 50;",
    [filter]
  ).then((results) => {
    res.json(results.rows)
  }).catch((e) => {
    console.error(e)
    res.status(500)
    res.json({"error": e.message })
  })
})

// All other GET requests not handled before will return our React app
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

app.listen(port, () => console.log(`HelloNode app listening on port ${port}!`));
