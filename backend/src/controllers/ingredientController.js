import db from '../db/db.js';

export const createIngredientController = async (req, res) => {
    const t = await db.sequelize.transaction(); // Begin transaction
    try {
        const { name } = req.body;
        const ingredient = await db.Ingredient.create({ name }, { transaction: t });

        await t.commit(); // Commit transaction

        console.log('Ingredient created:', ingredient);
        res.status(201).json(ingredient);
    } catch (err) {
        await t.rollback(); // Roll back if something fails
        console.error(err);
        res.status(500).json({ error: 'Failed to create ingredient' });
    }
}

export const getAllIngredientsController = async (req, res) => {
    try {
        const ingredients = await db.Ingredient.findAll();
        res.status(200).json(ingredients);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch ingredients' });
    }
}
