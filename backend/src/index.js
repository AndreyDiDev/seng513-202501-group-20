import express from "express";
import cors from "cors";
import userRouter from './routes/user.mjs'
const app = express();
app.use(express.json());




const PORT=5003
app.use(cors({
    origin: 'http://localhost:3000', 
}));

app.get( '/api/backendEngineers', (req, res) =>{
    const users = [{id: 1, name: 'Zaid'}, {id:2 , name:'Juan'}]
    return res.status(200).json({users})
})
app.use(userRouter)

app.listen(PORT, ()=>{
    console.log('App listening on ' + PORT)
})