// server.js
const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// 提供 public 資料夾的所有內容
app.use(express.static(path.join(__dirname, 'public')));

// 預設首頁導向 index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
