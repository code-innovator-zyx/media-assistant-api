// src/app.ts

import 'module-alias/register';
import express from 'express';
import { router } from './router/index';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(router);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
