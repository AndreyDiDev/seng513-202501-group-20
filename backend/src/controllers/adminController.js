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
    
    console.log('Admin created:', user);
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
        console.log('COMMMENNTTTT ' + comment)
        await comment.destroy()
        res.status(200).json({messgae : 'Deleted comment'})
    }catch(err){
        console.log(err)
        res.status(500).json({error: "Failed to delete comment: "+err})
    }
}

// export const addComment = async (req,res)=>{
//     try {
//         const {comment} = req.body
//     } catch (err) {
        
//     }
// }