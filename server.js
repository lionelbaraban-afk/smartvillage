const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static assets (css/, js/, pages/)
app.use(express.static(path.join(__dirname, 'public')));

// V2 — prez route
app.get('/prez', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'prez', 'index.html'));
});

// V1 — root
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Smart Village running on port ${PORT}`));
