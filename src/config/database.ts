import { Sequelize } from 'sequelize';
import  dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../.env' });

// Create a Sequelize instance using the MySQL configuration from `.env`
const sequelize = new Sequelize(process.env.DB_NAME!, process.env.DB_USERNAME!,process.env.DB_PASSWORD!, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  port: Number(process.env.DB_PORT) || 3306,
  logging: false, // Disable logging for cleaner output, enable if needed
});

export default sequelize;
