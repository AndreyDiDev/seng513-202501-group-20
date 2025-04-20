import express from "express";
import cors from "cors";
import passport from 'passport'
import session from 'express-session'
import './strategies/local-strategy.mjs'

// Routers
import userRouter from './routes/user.mjs'
import authRouter from './routes/auth.mjs'
import recipeRouter from './routes/recipe.mjs'
import healthRouter from './routes/healthCheck.mjs'
import adminRouter from './routes/admin.mjs'
import commentRouter from './routes/comment.mjs'
import meRouter from './routes/me.mjs'


const app = express();
app.use(express.json());

const PORT=5003
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true, 
}));

app.use(
    session({
        secret: "zaid the dev",
        saveUninitialized: true,
        resave: false,
        cookie: {
            maxAge: 60000 * 60,
        },
    })
);

// Registering passport for auth and using express-session to track user
app.use(passport.initialize())
app.use(passport.session())

// Registering routes
app.use(userRouter)
app.use(authRouter)
app.use(healthRouter)
app.use(recipeRouter)
app.use(adminRouter)
app.use(commentRouter)
app.use(meRouter)


app.listen(PORT, ()=>{
    console.log('App listening on ' + PORT)
})