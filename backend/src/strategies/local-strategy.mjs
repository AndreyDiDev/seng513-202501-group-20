import passport from "passport";
import {Strategy} from "passport-local"
import {comparePassword} from "../utils/authHelper.mjs"
import db from "../db/db.js"

passport.serializeUser((user, done)=>{
    done(null, user.id)
})

passport.deserializeUser( async (id,done)=>{
    try {
        const findUser = await db.User.findByPk(id)
        if (!findUser) throw new Error('User not found')
        done(null, findUser)
    } catch (err) {
        done(err, null)
    }
})

export default passport.use(
    new Strategy( {usernameField: 'email'},async (email, password, done)=>{
        try {
            console.log(email, password)
            const findUser = await db.User.findOne({
                where:{
                    email: email
                }
            })
            console.log('here left')
            if (!findUser) throw new Error('User not found')
            if (!comparePassword(password,findUser.hashedPassword )) throw new Error("Bad Credentials"); 
            done(null, findUser)
        } catch (error) {
            done(error, null)
        }
    })
)