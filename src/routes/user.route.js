import { Router } from 'express';
import userController from '../controllers/user.controller.js';
import middlewares from '../middlewares/global.middlewares.js';

const route = Router();

route.post('/', userController.create);
route.get('/', userController.findAll);
route.get('/:id', middlewares.validId, middlewares.validUser, userController.findById);
route.patch('/:id', middlewares.validId, middlewares.validUser, userController.update);

export default route;