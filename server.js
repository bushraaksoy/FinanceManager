import express from 'express';
import router from './routes/api.js';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

const swaggerDocument = YAML.load('./swagger.yaml');
const app = express();
const PORT = process.env.PORT || 3002;

// Serve Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(
    cors({
        origin: '*',
    })
);
app.use(express.json());
app.use('/api/v1', router);

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}...`);
});
