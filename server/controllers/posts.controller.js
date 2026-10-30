const Post = require('../models/post.model.js');
const User = require('../models/user.model.js');

Post.belongsTo(User, {
    foreignKey: 'userId',
    as: 'author'
});

exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.findAll({
            attributes: ['id', 'userId', 'content', 'createdAt'],
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['id', 'username']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        const result = posts.map((post) => ({
            id: String(post.id),
            userId: String(post.userId),
            content: post.content,
            createdAt: post.createdAt,
            author: {
                id: String(post.author.id),
                username: post.author.username
            },
            comments: []
        }));

        return res.status(200).json(result);
    } catch (error) {
        console.error('Erreur de lecture des publications :', error);

        return res.status(500).json({
            error: 'Impossible de récupérer les publications.'
        });
    }
};

exports.createPost = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                error: 'Authentification requise.'
            });
        }

        const content = req.body?.content;

        if (typeof content !== 'string') {
            return res.status(400).json({
                error: 'Le contenu doit être une chaîne de caractères.'
            });
        }

        const trimmedContent = content.trim();

        if (
            trimmedContent.length === 0 ||
            trimmedContent.length > 2000
        ) {
            return res.status(400).json({
                error: 'Le contenu doit contenir entre 1 et 2000 caractères.'
            });
        }

        const newPost = await Post.create({
            content: trimmedContent,
            userId: req.user.id
        });

        await newPost.reload({
            attributes: ['id', 'userId', 'content', 'createdAt'],
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['id', 'username']
                }
            ]
        });

        return res.status(201).json({
            id: String(newPost.id),
            userId: String(newPost.userId),
            content: newPost.content,
            createdAt: newPost.createdAt,
            author: {
                id: String(newPost.author.id),
                username: newPost.author.username
            },
            comments: []
        });
    } catch (error) {
        console.error('Erreur de création de publication :', error);

        return res.status(500).json({
            error: 'Impossible de créer la publication.'
        });
    }
};