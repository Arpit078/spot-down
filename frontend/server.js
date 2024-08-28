import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import compiler from './scripts/compile.js';
await compiler();


const app = express();
// Serve static files from the 'public' directory
app.use(express.static(join(__dirname)));

// Catch-all handler for any request that doesn't match the above
app.get('*', (req, res) => {
    console.log(__dirname)
  res.sendFile(join(__dirname, 'index.html'));
});

const port = process.env.PORT || 3000; // Use environment variable if available, otherwise default to 3000
app.listen(port, () => {
  console.log(`Application started on  http://localhost:${port}`);
});
