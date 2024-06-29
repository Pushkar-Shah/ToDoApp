import cors from 'cors'
import express, { response } from 'express';
import pool from './db.js'
import {v4 as uuidv4} from 'uuid';
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
const PORT = 8000
const app = express();
const saltRounds = 10;

app.use(cors());
app.use(express.json())
app.get("/",(req,res)=> { 
        res.send("Hello")
})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/todos/:useremail' , async (req,res)=>{
        const {useremail} = req.params;
        try {
              const todos = await pool.query("SELECT * FROM todos WHERE user_email = $1",[useremail])
              res.json(todos.rows)
        } catch (err) {
            console.error(err);    
        }
})

// Create a new todo.
app.post('/todos', async (req,res)=>{
        console.log(req.body);
        const {title,user_email,progress,date} = req.body;
        console.log(user_email,title,progress,date);
        const id = uuidv4();
        try {
                const response = await pool.query(`INSERT INTO todos (id,user_email,title,progress,date) VALUES ($1,$2,$3,$4,$5)`,[id,user_email,title,progress,date]);
                console.log(response);
                res.json(response);
        } catch (error) {
                console.log(error);
                res.sendStatus(500).json(response);

                
        }
})

// edit a new Todo
app.put('/todos/:id',async (req,res)=>{
        const {id} = req.params;
        console.log(req.body);
        const {title,user_email,progress,date} = req.body;
        try {
                const response = await pool.query("UPDATE todos SET user_email = $1, title = $2,progress = $3,date = $4 WHERE id = $5",[user_email,title,progress,date,id]);
                console.log(response);
                res.json(response);
                
        } catch (error) {
                console.log(error);  
                res.sendStatus(500).json(response);     
        }
})


// deleete a todo

app.delete('/todos/:id',async (req,res)=>{
        const {id} = req.params;
        // console.log(req.body);
        // const {title,user_email,progress,date} = req.body;
        try {
                const response = await pool.query("DELETE FROM todos WHERE id = $1",[id]);
                console.log(response);
                res.json(response);
                
        } catch (error) {
                console.log(error);  
                res.sendStatus(500).json(response);     
        }
})


// Authorization --> 

// login
app.post('/login', async(req,res)=>{
        const {email,password} = req.body;
        const hashedPassword = bcrypt.hashSync(password,saltRounds);
        try {
                const user = await pool.query(`SELECT * FROM users WHERE email = $1`,[email]);
                if (!user.rows.length){
                        return res.json({detail : 'User does not exist!'});
                }
                console.log(user.rows[0]);
                console.log(hashedPassword === user.rows[0].hashed_password);
                const success = await bcrypt.compare(password,user.rows[0].hashed_password);
                const authToken = jwt.sign({email},'secret',{expiresIn : '1 hr'});
                if(success){
                        res.json({ 'email' : email , authToken})
                }
                else{
                        res.json({detail : 'Password is Incorrect'});
                }
        } catch (error) {
                console.log(error);
        }
})

// signup
app.post('/signup', async(req,res)=>{
        const {email,password} = req.body;
        console.log(req.body);
        console.log(`Email: ${email} & Password: ${password}`);
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password,salt);
        try {
               const response = await pool.query(`INSERT INTO users (email,hashed_password) VALUES ($1,$2)`,[email,hashedPassword]);
               const authToken = jwt.sign({email},'secret',{expiresIn : '1 hr'});
               res.json({email,authToken});
        } catch (error) {
                console.log(error);
                if (error){
                        res.json({detail : error.detail})
                }
        }
        
})


console.log(app.listen(PORT,()=> `Server running on Port ${PORT}`))