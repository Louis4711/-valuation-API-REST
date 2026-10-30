const { Post, User, Comment } = require('../models/user.model.js');

exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.findAll({
            attributes: ['id', 'userId', 'content', 'createdAt'],
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['id', 'username']
                },
                {
                    model: Comment,
                    as: 'comments',
                    attributes: [
                        'id',
                        'postId',
                        'userId',
                        'content',
                        'createdAt'
                    ],
                    separate: true,
                    order: [['createdAt', 'ASC']],
                    include: [
                        {
                            model: User,
                            as: 'author',
                            attributes: ['id', 'username']
                        }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        return res.status(200).json(posts);
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
            id: newPost.id,
            userId: newPost.userId,
            content: newPost.content,
            createdAt: newPost.createdAt,
            author: {
                id: newPost.author.id,
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