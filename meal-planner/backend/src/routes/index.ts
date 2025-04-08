import { Router } from 'express';
import IndexController from '../controllers/index';
import { Application } from 'express-serve-static-core';

const router = Router();
const indexController = new IndexController();

export function setRoutes(app: Application) {
    app.use('/api', router);
    router.get('/', indexController.getIndex);
    // Add more routes here as needed
}