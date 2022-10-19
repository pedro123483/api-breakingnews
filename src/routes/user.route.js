import express from 'express';
import userController from '../controllers/user.controller.js';

const route = express.Router();

route.get('/', userController.soma);

export default route;