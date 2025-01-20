import express from 'express';
import router from './routes/api.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3002;

app.use(
    cors({
        origin: '*',
    })
);
app.use(express.json());
// app.use('/api/v1', router);
app.use(router);

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}...`);
});
