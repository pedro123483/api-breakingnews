import newsService from '../services/news.service.js';

const create = async (req, res) => {
    try {
        const { title, text, banner } = req.body;

        if(!title || !text || !banner) {
            res.status(400).send({
                message: 'Submit all fields for registration'
            });
        }

        await newsService.createService({
            title,
            text,
            banner,
            user: req.userId
        });
        
        res.sendStatus(201);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

const findAll = async (req, res) => {
    try {
        let { limit, offset } = req.query;

        limit = Number(limit);
        offset = Number(offset);

        if(!limit) {
            limit = 5;
        }

        if(!offset) {
            offset = 0;
        }

        const news = await newsService.findAllService(offset, limit);
        const total = await newsService.countNews();
        const currentUrl = req.baseUrl;

        const next = offset + limit;
        const nextUrl = next < total ? `${currentUrl}?limit=${limit}&offset=${next}` : null;

        const previous = offset - limit < 0 ? null : offset - limit;
        const previousUrl = previous != null ? `${currentUrl}?limit=${limit}&offset=${previous}` : null;

        if(news.length === 0) {
            return res.status(400).send({
                message: 'there are no registered news'
            });
        }
        res.send({
            nextUrl,
            previousUrl,
            limit,
            offset,
            total,

            results: news.map(item => ({
                id: item._id,
                title: item.title,
                text: item.text,
                banner: item.banner,
                likes: item.likes,
                comments: item.comments,
                name: item.user.name,
                userName: item.user.username,
                userAvatar: item.user.avatar,
            })),
        });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

const topNews = async (req, res) => {
    try {
        const news = await newsService.topNewsService();
    
        if(!news) {
            return res.status(400).send({ message: 'There is no registered post' });   
        }

        res.send({
            news: {
                id: news._id,
                title: news.title,
                text: news.text,
                banner: news.banner,
                likes: news.likes,
                comments: news.comments,
                name: news.user.name,
                userName: news.user.username,
                userAvatar: news.user.avatar,
            }
        });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

const findById = async (req, res) => {
    try {
        const { id } = req.params;

        const news = await newsService.findByIdService(id);

        res.send({
            news: {
                id: news._id,
                title: news.title,
                text: news.text,
                banner: news.banner,
                likes: news.likes,
                comments: news.comments,
                name: news.user.name,
                userName: news.user.username,
                userAvatar: news.user.avatar,
            }
        });
        
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

const searchByTitle = async (req, res) => {
    try {
        const { title } = req.query;

        const news = await newsService.searchByTitleService(title);

        if(news.length === 0) {
            return res.status(400).send({ message: 'There are no news with this title' });
        }

        return res.send({
            results: news.map(item => ({
                id: item._id,
                title: item.title,
                text: item.text,
                banner: item.banner,
                likes: item.likes,
                comments: item.comments,
                name: item.user.name,
                userName: item.user.username,
                userAvatar: item.user.avatar,
            }))
        });

    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

const byUser = async (req, res) => {
    try {
        const id = req.userId;
        const news = await newsService.byUserService(id);

        return res.send({
            results: news.map(item => ({
                id: item._id,
                title: item.title,
                text: item.text,
                banner: item.banner,
                likes: item.likes,
                comments: item.comments,
                name: item.user.name,
                userName: item.user.username,
                userAvatar: item.user.avatar,
            }))
        });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

const update = async (req, res) => {
    try {
        const { title, text, banner } = req.body;
        const { id } = req.params;

        if (!title && !text && !banner) {
            res.status(400).send({ message: 'Submit at least one field to update the post' });
        }

        const news = await newsService.findByIdService(id);

        if(news.user._id != req.userId) {
            return res.status(400).send({ message: 'You cannot update this post' });
        }

        await newsService.updateService(id, title, text, banner);

        return res.status(200).send({ message: 'Post successfully updated' });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

const erase = async (req, res) => {
    try {
        const { id } = req.params;

        const news = await newsService.findByIdService(id);

        if(news.user._id != req.userId) {
            return res.status(400).send({
                message: 'You cannot delete this post'
            });
        }

        await newsService.eraseService(id);

        return res.status(200).send({ message: 'News deleted successfully' });

    } catch (error) {
        res.status(500).send({ message: error.message });   
    }
}

const likeNews = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const newsLiked = await newsService.likeNewsService(id, userId);

        if(!newsLiked) {
            await newsService.deletelikeNewsService(id, userId);

            return res.status(200).send({ message: 'Like successfully removed' });
        }

        res.send({ message: 'Like done successfully' });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

const addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const { comment } = req.body;

        if(!comment) {
            return res.status(400).send({ message: 'Write a message to comment' });
        }

        await newsService.addCommentService(id, comment, userId);

        return res.send({
            message: 'Comment successfully completed!'
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

const deleteComment = async (req, res) => {
    try {
        const { idNews, idComment } = req.params;
        const userId = req.userId;

        const commentDeleted = await newsService.deleteCommentService(idNews, idComment, userId);

        const commentFinder = commentDeleted.comments.find((comment) => comment.idComment === idComment);

        if(!commentFinder) {
            return res.status(404).send({ message: 'Comment not found' });
        }
        
        if(commentFinder.userId !== userId) {
            return res.status(400).send({ message: 'You cannot delete this comment' });
        }

        return res.send({
            message: 'Comment successfully deleted!'
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

export default {
    create,
    findAll,
    topNews,
    findById,
    searchByTitle,
    byUser,
    update,
    erase,
    likeNews,
    addComment,
    deleteComment
}