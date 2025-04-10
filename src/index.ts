import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import morgan from 'morgan';
import logger from './logger';
import sequelize from './config/database';
import contentTypeRoutes from "./routes/contentTypeRoutes";
import bodyParser from 'body-parser';



const PORT = process.env.PORT;
const app = express();

app.use(bodyParser.json());

// Middleware for logging requests
app.use(morgan('combined'));

app.get('/', (req, res) => {
    logger.info('Hello, world endpoint hit');
    res.send('Hello, world!');
  });

// app.get('/error', (req, res) => {
//   const errorMessage = 'Something went wrong';
//   logger.error(errorMessage);
//   res.status(500).send(errorMessage);
// });
app.use("/api", contentTypeRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection to MySQL database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testConnection();
