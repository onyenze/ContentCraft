import express from "express";
import dotenv from 'dotenv';
dotenv.config();
import morgan from 'morgan';
import logger from './logger';
import contentTypeRoutes from "./routes/contentTypeRoutes";
import contentItemRoutes from "./routes/contentItemRoutes";
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import roleRoutes from './routes/roleRoutes';
import deliveryRoutes from './routes/deliveryRoutes';
import fieldDefinitionRoutes from './routes/fieldDefinitionsRoutes';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

const swaggerDocument = YAML.load('./src/docs/api-spec.yaml');


const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
app.use("/api", contentItemRoutes);
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", roleRoutes);
app.use("/api", deliveryRoutes);
app.use('/api', fieldDefinitionRoutes);





export default app
