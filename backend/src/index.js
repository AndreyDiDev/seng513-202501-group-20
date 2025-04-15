import express from "express";
import cors from "cors";
import userRouter from './routes/user.mjs'
import authRouter from './routes/auth.mjs'
import passport from 'passport'
import session from 'express-session'
import './strategies/local-strategy.mjs'


const app = express();
app.use(express.json());

const PORT=5003
app.use(cors({
    origin: 'http://localhost:3000', 
}));

app.use(
    session({
        secret: "anson the dev",
        saveUninitialized: true,
        resave: false,
        cookie: {
            maxAge: 60000 * 60,
        },
    })
);

app.use(passport.initialize())
app.use(passport.session())

app.get( '/api/backendEngineers', (req, res) =>{
    const users = [{id: 1, name: 'Zaid'}, {id:2 , name:'Juan'}]
    return res.status(200).json({users})
})



app.use(userRouter)
app.use(authRouter)


app.listen(PORT, ()=>{
    console.log('App listening on ' + PORT)
})