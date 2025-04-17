import db from "../db/db.js";
import { hashPassword } from "../utils/authHelper.mjs";

const ADMIN_PIN = 5659

export const createAdminController = async (req, res) => {
  try {
    const { name, email ,password, enteredPin } = req.body;
    const role = 'admin';
    const hashedPassword = hashPassword(password)

    if (enteredPin != ADMIN_PIN) throw new Error('Admin Pin Does Not Match')

    const user = await db.User.create({ name, email, hashedPassword, role});
    
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create Admin: ' + err });
  }
};


export const getAdminDashboardController = async (req,res) => {
    try {
        const allUsers = await db.User.findAll()
        const allRecipies = await db.Recipe.findAll()
        const allComments = await db.Comment.findAll()

        res.status(200).json({allUsers, allRecipies, allComments})
    } catch (err) {
        res.status(404).json({error: "Failed to get requested resources: " + err})
    }
}

export const getAdminCommentsController = async (req, res) => {
    try {
        const allComments = await db.Comment.findAll()
        res.status(200).json({allComments})
    } catch (err) {
        res.status(404).json({error: "Failed to get requested resources: " + err})
    }
}

export const adminDeleteCommentController = async (req,res)=>{
    try{
        const {commentID} = req.body;
        const comment = await db.Comment.findByPk(commentID)
        await comment.destroy()
        res.status(200).json({messgae : 'Deleted comment'})
    }catch(err){
        console.log(err)
        res.status(500).json({error: "Failed to delete comment: "+err})
    }
}

export const adminGetAllUsersController = async (req ,res)=>{
    try {
        const allUsers = await db.User.findAll()
        res.status(200).json(allUsers)
    } catch (err) {
        console.log(err)
        res.status(404).json({error: "Failed to get requested resources: " + err})
    }
}

export const adminDeleteUserController = async (req,res)=>{
    try{
        const {userID} = req.body;
        const user = await db.User.findByPk(userID)
        await user.destroy()
        res.status(200).json({messgae : 'Deleted user'})
    }catch(err){
        console.log(err)
        res.status(500).json({error: "Failed to delete user: "+err})
    }
}

export const adminMakeUserPremiumController = async (req, res) => {
    try {
        const { userID} = req.body;

        const user = await db.User.findByPk(userID);
        if (!user) {
        return res.status(404).json({ error: 'User not found' });
        }

        user.role = 'premium';
        await user.save();

        res.status(200).json({ message: `User ${user.name} is now a premium member.` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update user role' });
    }
};
  
export const adminMakeUserNormalController = async (req, res) => {
    try {
        const { userID } = req.body;

        const user = await db.User.findByPk(userID);
        if (!user) {
        return res.status(404).json({ error: 'User not found' });
        }

        user.role = 'normal';
        await user.save();

        res.status(200).json({ message: `User ${user.name} is now a normal user.` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update user role' });
    }
};