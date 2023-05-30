'use strict';

const express = require('express');
const server = express();
const cors = require('cors');
require('dotenv').config();
const pg = require('pg');

server.use(cors());
const PORT = process.env.PORT || 3000;
const axios = require('axios');


server.use(express.json());

const client = new pg.Client(process.env.DATABASE_URL);


server.get('/home/:username', homeHandler)
server.get('/gettasks', getTasksHandler)
server.post('/addtask', addTasksHandler)
server.get('/randomTask/:type', randomTask);
server.post('/login', loginHandler)
server.post('/signup', signUpHandler)
server.put('/updateGenTasks/:id', updateGentasks);
server.put('/updateiscomplete/:id', updateIsCompletedHandler);
server.put('/updategentasks/:id', updategentasks);
server.delete('/deleteTask/:id', deleteTask);
server.get('/getCalendarDate/:username', getCalendarDateByUsernameHandler);
server.get('/getCalendarDate/:username/:date', getCalendarDateByUsernameAndDateHandler);





server.get("*", defaultHandler)
server.use(errorHandler)

function homeHandler(req, res) {
    try {
        const { username } = req.params;
        res.send({ username: username });
    }
    catch (error) {
        errorHandler(error, req, res)
    }
}
function randomTask(req, res) {
    const { type } = req.params
    const url = process.env.API_URL + `?type=${type}`;
    try {
        axios.get(url)


        .then(result=>{
            res.send(result.data)
          
        })
        .catch((error)=>{
            errorHandler(error,req,res)
        })

            .then(result => {

                res.send(result.data)
            })
            .catch((error) => {
                errorHandler(error, req, res)
            })

    }
    catch (error) {
        errorHandler(error, req, res)
    }
}



function getTasksHandler(req, res) {
    const { username } = req.query;
    const sql = `SELECT * FROM gentasks WHERE username = '${username}';`;
    client.query(sql)
        .then(data => {
            console.log(data.rows);
            res.send(data.rows);
        })
        .catch((error) => {
            errorHandler(error, req, res);
        })
}

function addTasksHandler(req, res) {
    const taskValues = req.body;
    const sql = `INSERT INTO gentasks (username,task_type,due_date,activity,comments,is_completed)
        VALUES ($1,$2,$3,$4,$5,$6);`;
    const Values = [taskValues.username,taskValues.task_type, taskValues.due_date, taskValues.activity, taskValues.comments, taskValues.is_completed];
    client.query(sql, Values)
        .then(data => {
          res.send(data)
          
        })
        .catch((error) => {
            errorHandler(error, req, res);
        })
}
function loginHandler(req, res) {
    const { username, password } = req.body;

    const sql = 'SELECT * FROM users WHERE username = $1 AND password = $2';
    const values = [username, password];
    client.query(sql, values)
        .then(result => {
            if (result.rowCount > 0) {
                res.redirect('/home/' + username);
            }
            else {
                res.send("login failed");
            }
        })
        .catch((error) => {
            console.log(error)
        })
}

function signUpHandler(req, res) {
    const { username, email, password } = req.body;
    const sql = `SELECT * FROM users where username=$1;`;
    const useernameValue = [username];
    client.query(sql, useernameValue)
        .then((exist) => {
            if (exist.rowCount > 0) {
                res.send("username already exist");
            }
            else {
                const text = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3);`;
                const values = [username, email, password];
                client.query(text, values)
                    .then((result) => {
                        res.send(`You Signed Up Successfully`);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        })
        .catch((error) => {
            console.log(error);
        })

}
function updategentasks(req, res) {
    const { id } = req.params;
    const sql = `UPDATE gentasks SET username=$1 ,task_type = $2, due_date = $3, activity = $4, comments = $5 , is_completed = $6 WHERE id=${id};`

    const { username,task_type, due_date, activity, comments, is_completed,  } = req.body;
    const values = [ username,task_type, due_date, activity, comments, is_completed, ];

    client.query(sql, values)
        .then((data) => {
            const sql = `SELECT * FROM gentasks;`;
            client.query(sql)
                .then(allData => {
                    res.status(200).send(allData.rows)
                })
        })
        .catch((error) => {
            errorHandler(error, req, res)
        })
}

function updateIsCompletedHandler(req, res) {
    const { id } = req.params;
    const sql = `UPDATE gentasks SET is_completed = $1 WHERE id=${id};`

    const {  is_completed } = req.body;
    const values = [  is_completed ];

    client.query(sql, values)
        .then((data) => {
            const sql = `SELECT * FROM gentasks;`;
            client.query(sql)
                .then(allData => {
                    res.status(200).send(allData.rows)
                })
        })
        .catch((error) => {
            errorHandler(error, req, res)
        })
}



function deleteTask(req, res) {
    console.log("Task deleted");
    const { id } = req.params;
    const sql = `DELETE FROM gentasks WHERE id=${id}`
    client.query(sql)
        .then((data) => {

            res.send("ok")
            // const sql = `SELECT * FROM gentasks;`;
            // client.query(sql)
            //     .then(allData => {
            //         res.send(allData.rows)
            //     })

        })
        .catch((error) => {
            errorHandler(error, req, res)
        })

}
/* function updateTasks(req, res) {
    const { id } = req.params;
    const sql = `UPDATE tasks SET content = $1 is_completed = $2 WHERE id=${id};`

    const { content, is_completed } = req.body;
    const values = [content, is_completed];

    client.query(sql, values)
        .then((data) => {
            const sql = `SELECT * FROM tasks;`;
            client.query(sql)
                .then(allData => {
                    res.status(200).send(allData.rows)
                })





        })
        .catch((error) => {
            errorHandler(error, req, res)
        })
}
 */
function getCalendarDateByUsernameHandler(req, res) {
    const { username } = req.params;
  
    const sql = `SELECT * FROM gentasks WHERE username = $1;`;
    const values = [username];
  
    client.query(sql, values)
      .then((data) => {
        res.send(data.rows);
      })
      .catch((error) => {
        errorHandler(error, req, res);
      });
  }
  
  // Handler for /getCalendarDate/:username/:date
  function getCalendarDateByUsernameAndDateHandler(req, res) {
    const { username, date } = req.params;
  
    const sql = `SELECT * FROM gentasks WHERE username = $1 AND due_date = $2;`;
    const values = [username, date];
  
    client.query(sql, values)
      .then((data) => {
        res.send(data.rows);
      })
      .catch((error) => {
        errorHandler(error, req, res);
      });
  }

const status404 = {
    "status": 404,
    "responseText": "Sorry, page not found error"
};
function defaultHandler(req, res) {
    res.status(404).send(status404);
};
function errorHandler(error, req, res) {
    const err = {
        "status": 500,
        "message": error
    }
    res.status(500).send(err);
};

client.connect()
.then(()=>{
    server.listen(PORT,()=>{
        console.log(`listening to ${PORT} i'm ready`)
        
    });
})
