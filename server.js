import express from 'express';
import router from './routes/index.js';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import fs from 'fs';
import multer from 'multer';

const swaggerDocument = YAML.load('./swagger.yaml');
// const swaggerDocument = JSON.parse(
//     fs.readFileSync('./swagger-output.json', 'utf8')
// );

const app = express();
const PORT = process.env.PORT || 3002;
const upload = multer({ dest: 'uploads/images' });

// Serve Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(
    cors({
        origin: '*',
    })
);
app.use(express.json());
app.use('/api/v1', router);
app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}...`);
});
