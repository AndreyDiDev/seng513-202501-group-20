import { where } from 'sequelize';
import db from '../db/db.js';
import { hashPassword } from '../utils/authHelper.mjs';

export const createRecipeController = async (req, res) => {
    try {
        const {id, title, time, calories, instructions, createdAt, updatedAt, createdBy} = req.body;
        const recipe = await db.Recipe.create({id, title, time, calories, instructions, createdAt, updatedAt, createdBy});
        console.log('Recipe created:', recipe);
        res.status(201).json(recipe);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create recipe' });
    }
};