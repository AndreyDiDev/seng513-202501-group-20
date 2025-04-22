import db from '../db/db.js';


// Import helper functions
const {Op, literal} = db.Sequelize;

// Create a new recipe
export const createRecipeController = async (req, res) => {
    const t = await db.sequelize.transaction(); // Begin transaction
    try {
        const { title, time, calories, instructions,ingredients } = req.body;
        const createdBy = req.user.id; // Get the user ID from the request
        const recipe = await db.Recipe.create({ title, time, calories, instructions, createdBy}, { transaction: t });

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

// Remove a recipe
export const removeRecipeController = async (req, res) => {
    const t = await db.sequelize.transaction(); // Begin transaction
    try {
        const { id } = req.params;
        const recipe = await db.Recipe.findByPk(id, { transaction: t });

        if (!recipe) {
            console.log('Recipe not found:', id);
            return res.status(404).json({ error: 'Recipe not found' });
        }

        await recipe.destroy({ transaction: t });
        await t.commit(); // Commit transaction

        console.log('Recipe deleted:', recipe);
        res.status(200).json({ message: 'Recipe deleted successfully' });
    } catch (err) {
        await t.rollback(); // Roll back if something fails
        console.error(err);
        res.status(500).json({ error: 'Failed to delete recipe' });
    }
}

// Get all recipes that only have the chosen ingredients (but not necessarily all of the chosen ingredients) and no others
export const getRecipesByIngredients = async (req, res) => {
    const t = await db.sequelize.transaction();

    try {
        const { ingredients } = req.body;

        // Get ingredient records from names
        const ingredientRecords = await db.Ingredient.findAll({
            where: {
                name: {
                    [Op.in]: ingredients
                }
            },
            transaction: t
        });

        const desiredIngredientIds = ingredientRecords.map(i => i.id);

        const recipes = await db.Recipe.findAll({
            include: {
                model: db.Ingredient,
                attributes: ['name'],
                through: { attributes: [] }, // Don't need join table attributes
                required: true
            },
            group: ['Recipe.id'],
            having: literal(`
                COUNT("Ingredients"."id") = SUM(CASE 
                    WHEN "Ingredients"."id" IN (${desiredIngredientIds.join(',')}) THEN 1 
                    ELSE 0 
                END)
            `),
            transaction: t
        });

        await t.commit();
        res.status(200).json(recipes);
    } catch (err) {
        await t.rollback();
        console.error(err);
        res.status(500).json({ error: 'Failed to get recipes' });
    }
};

// Get all recipes
export const getAllRecipesController = async (req, res) => {
    try {
        const recipes = await db.Recipe.findAll();
        res.status(200).json(recipes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to get recipes' });
    }
};