import db from '../db/db.js';

export const createCommentController = async (req, res) => {
    const t = await db.sequelize.transaction(); // Begin transaction
    try {
        const { name, commentText, likeCount, userId, recipeId} = req.body;
        const comment = await db.Comment.create({ name, commentText, likeCount, userId, recipeId }, { transaction: t });

        await t.commit(); // Commit transaction

        console.log('Comment created:', comment);
        res.status(201).json(comment);
    } catch (err) {
        await t.rollback(); // Roll back if something fails
        console.error(err);
        res.status(500).json({ error: 'Failed to create comment' });
    }
};

export const deleteCommentController = async (req, res) => {
    const t = await db.sequelize.transaction(); // Begin transaction
    try {
        const { id } = req.params;
        const comment = await db.Comment.findByPk(id, { transaction: t });

        if (!comment) {
            console.log('Comment not found:', id);
            return res.status(404).json({ error: 'Comment not found' });
        }

        await comment.destroy({ transaction: t });
        await t.commit(); // Commit transaction

        console.log('Comment deleted:', comment);
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (err) {
        await t.rollback(); // Roll back if something fails
        console.error(err);
        res.status(500).json({ error: 'Failed to delete comment' });
    }
}

export const getCommentsByRecipeIdController = async (req, res) => {
    const t = await db.sequelize.transaction(); // Begin transaction
    try {
        const { recipeId } = req.params;
        const comments = await db.Comment.findAll({
            where: { recipeId },
            transaction: t
        });

        await t.commit(); // Commit transaction

        console.log('Comments retrieved for recipe:', recipeId);
        res.status(200).json(comments);
    } catch (err) {
        await t.rollback(); // Roll back if something fails
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve comments' });
    }
};

export const getAllCommentsController = async (req, res) => {
    const t = await db.sequelize.transaction(); // Begin transaction
    try {
        const comments = await db.Comment.findAll({
            transaction: t
        });

        await t.commit(); // Commit transaction

        console.log('All comments retrieved');
        res.status(200).json(comments);
    } catch (err) {
        await t.rollback(); // Roll back if something fails
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve comments' });
    }
}