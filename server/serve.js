const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');

app.use(express.static(path.resolve(__dirname, '../client/dist')))

// Handle GET requests to /api route
app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
});

app.listen(port, () => console.log(`HelloNode app listening on port ${port}!`));
