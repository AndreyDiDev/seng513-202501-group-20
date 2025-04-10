import db from '../db/db.js';

const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await db.User.create({ name, email });
    console.log('User created:', user);
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

export default createUser;
