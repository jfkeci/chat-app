import express from "express";
import cors from "cors";
import dotenv from "dotenv"

import authRoutes from './resources/auth/auth.routes.js'

dotenv.config();

const port = process.env.PORT | 5001;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))


app.get('/', (req, res) => {
  return res.send('Welcome to chat app API');
})

app.use('/auth', authRoutes);

app.listen(port, () => {
  console.log('Server running @' + port);
})
