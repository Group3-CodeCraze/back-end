const express =require("express");
const server =express();
const cors = require("cors");
const axios =require("axios");
server.use(cors());
require("dotenv").config();
const pg = require("pg");
server.use(express.json());


let PORT=process.env.PORT || 3000;


const client =new pg.Client(process.env.DATABASE_URL) 
server.get('/',homeHandler);

server.get('/randomTask/:type',randomTask);

function randomTask (req,res){
    const {type}=req.params
    const url =`http://www.boredapi.com/api/activity?type=${type}`
    try{
        axios.get(url)

        .then(result=>{

            res.send(result.data)
        })
        .catch((error)=>{
            errorHandler(error,req,res)
        })
    }
    catch (error){
        errorHandler(error,req,res)
    }
}



server.get("*",defaultHandler);


server.use(errorHandler);

function defaultHandler(req,res){
    res.status(400).send(`default route`)
};

function homeHandler(req,res){
    res.status(200).send(`HOME`)
};

function errorHandler(error,req,res){
    const err ={
        status:500,
        errorMessages:error
    }
    res.send(err)
};

client.connect()
.then(()=>{
    server.listen(PORT,()=>{
        console.log(`listening to ${PORT} i'm ready`)
    });
})
