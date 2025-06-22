//  File: backend/server.js
import express from 'express';
// import bodyParser from 'body-parser';
import emergencyRouter from './routes/emergency.js';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/api/emergency', emergencyRouter);

app.listen(PORT, () => {
  console.log(`🚨 Server is running on http://localhost:${PORT}`);
});
