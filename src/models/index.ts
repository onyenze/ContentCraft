import { Sequelize } from 'sequelize';
import  dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

export default sequelize;
