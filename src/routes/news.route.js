import { Router } from 'express';
import newsController from '../controllers/news.controller.js';
import middlewares from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', newsController.findAll);
router.get('/top', newsController.topNews);
router.get('/search', newsController.searchByTitle);
router.get('/byUser', middlewares.authMiddleware, newsController.byUser);
router.get('/:id', middlewares.authMiddleware, newsController.findById);
router.post('/', middlewares.authMiddleware, newsController.create);
router.patch('/:id', middlewares.authMiddleware, newsController.update);
router.delete('/:id', middlewares.authMiddleware, newsController.erase);
router.patch('/like/:id', middlewares.authMiddleware, newsController.likeNews);
router.patch('/comment/:id', middlewares.authMiddleware, newsController.addComment);
router.patch('/comment/:idNews/:idComment', middlewares.authMiddleware, newsController.deleteComment);

export default router;