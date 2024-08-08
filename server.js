import path from 'path';
import express from 'express';
const app = express();
const PORT = 8000;
const SRC_DIR = path.join(__dirname, '/src');
app.use('/static', express.static(SRC_DIR));
app.get('/', (req, res) => {
    const filePath = path.join(SRC_DIR, 'index.html');
    res.sendFile(filePath);
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
const srcPath = path.resolve(__dirname, '../src');
console.log(srcPath);
