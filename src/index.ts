import dotenv from 'dotenv';
dotenv.config();
import app from "./app"
import sequelize from './config/database';


const PORT = process.env.PORT;



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
