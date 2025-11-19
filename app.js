import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import userRoutes from './Routes/userRoutes.js';
import { exceptionHandlingMiddleware } from './middlewares/ExceptionHandling.js';


dotenv.config({path:'./Config/config.env'});
const app=express();


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true,
    method:['POST','GET','PUT']
}));
app.use('/api/s1',userRoutes);
app.use(exceptionHandlingMiddleware);




export default app;

