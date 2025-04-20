import db from '../db/db.js';
import { hashPassword } from '../utils/authHelper.mjs';

export const createUserController = async (req, res) => {
  try {
  
    const { name, email ,password } = req.body;
    const hashedPassword = hashPassword(password)
    const  user = await db.User.create({ name, email, hashedPassword});

    res.status(201).json(user);
  
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user' });
  }
};


export const getUserFromID = async (req, res) => {
  try {
    const {userId} = req.body;
    const user = await db.User.findByPk(userId)
    if (!user) throw new Error('User not found')
    res.status(200).json({'userId': user.id,'name': user.name, 'email': user.email})
  } catch (err) {
    console.error(err)
    res.status(500).json({error: 'Cannot find user'})
  }
}

export const getUserFromEmail = async (req, res) => {
  try {
    const {email} = req.query;
    const user = await db.User.findOne({where: {email}})
    if (!user) throw new Error('User not found')
    res.status(200).json({'userId': user.id,'name': user.name, 'email': user.email})
  } catch (err) {
    console.error(err)
    res.status(500).json({error: 'Cannot find user'})
  }
}

export const buyPremiumController = async (req, res) => {
  try {
    const user = req.user;
    // console.log(req)
    console.log(req.user)
    console.log(user)
    if (!user) throw new Error('User not found');
    if (user.role === "premium") throw new Error('User is already premium');
    
    await user.update({ role: "premium" });
    res.status(200).json({ message: 'User upgraded to premium' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upgrade user to premium' });
  }
}