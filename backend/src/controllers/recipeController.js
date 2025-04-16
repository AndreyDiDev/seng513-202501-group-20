import { where } from 'sequelize';
import db from '../db/db.js';
import { hashPassword } from '../utils/authHelper.mjs';

export const createRecipeController = async (req, res) => {
    const t = await db.sequelize.transaction(); // Begin transaction
    try {
        const { title, time, calories, instructions, createdBy, ingredients } = req.body;
        const recipe = await db.Recipe.create({ title, time, calories, instructions, createdBy }, { transaction: t });

        // Process ingredients safely
        const ingredientRecords = [];
        for (const name of ingredients) {
        const [ingredient] = await db.Ingredient.findOrCreate({
            where: { name },
            transaction: t
        });
        ingredientRecords.push(ingredient);
        }

        await recipe.addIngredients(ingredientRecords, { transaction: t });
        await t.commit(); // Commit transaction

        console.log('Recipe created:', recipe);
        res.status(201).json(recipe);
    } catch (err) {
        await t.rollback(); // Roll back if something fails
        console.error(err);
        res.status(500).json({ error: 'Failed to create recipe' });
    }
};
  