import path from 'path';
import express, { Request, Response } from 'express';

const app = express();
const PORT = 8000;

const SRC_DIR = path.join(__dirname, '/src');

app.use('/static', express.static(SRC_DIR));

app.get('/', (req: Request, res: Response) => {
  const filePath = path.join(SRC_DIR, 'index.html');
  res.sendFile(filePath);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});