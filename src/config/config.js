const dotenv =   require('dotenv');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',  // or 'mysql' for MySQL,
    "port": 3306
  },JWT_SECRET,
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',  // or 'mysql' for MySQL
  }
};
