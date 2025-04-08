import express from 'express';
import { json } from 'body-parser';
import { setRoutes } from './routes/index';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(json());

// Set up routes
setRoutes(app);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});