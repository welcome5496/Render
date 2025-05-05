const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.json());

const dataFile = path.join(__dirname, "portals.json");

app.get("/api/portals", (req, res) => {
  const data = fs.readFileSync(dataFile);
  res.json(JSON.parse(data));
});

app.post("/api/portals", (req, res) => {
  const { name, url } = req.body;
  const portals = JSON.parse(fs.readFileSync(dataFile));
  portals.push({ name, url });
  fs.writeFileSync(dataFile, JSON.stringify(portals, null, 2));
  res.status(201).json({ message: "Portal added" });
});

app.delete("/api/portals/:index", (req, res) => {
  const index = parseInt(req.params.index);
  const portals = JSON.parse(fs.readFileSync(dataFile));
  if (index >= 0 && index < portals.length) {
    portals.splice(index, 1);
    fs.writeFileSync(dataFile, JSON.stringify(portals, null, 2));
    res.json({ message: "Portal deleted" });
  } else {
    res.status(400).json({ error: "Invalid index" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
