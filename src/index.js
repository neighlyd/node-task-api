require ('./db/mongoose')
const express = require('express')

const taskRouter = require('./routes/task')
const userRouter = require('./routes/user')

// set port to ENV var if set or 3000 if not.
const port = process.env.PORT
let app = express()

// Set middleware to inject bodyParser to convert JSON to Javascript object
app.use(express.json())
app.use(taskRouter)
app.use(userRouter)

app.listen(port, () => {
    console.log(`Started on port ${port}`)
});

module.exports = app