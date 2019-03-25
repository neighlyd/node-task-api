require ('./db/mongoose')
const express = require('express')

const taskRouter = require('./routes/task')
const userRouter = require('./routes/user')

let app = express()

app.use(express.json())
app.use(taskRouter)
app.use(userRouter)

module.exports = app