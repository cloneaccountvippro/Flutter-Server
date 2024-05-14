const express = require("express")
const app = express();
const cors = require('cors')
const auth = require('./route/authRoute.js')
const user = require('./route/userRoute.js')
const folder = require('./route/folderRoute.js')
const topic = require('./route/topicRoute.js')
const word = require('./route/wordRoute.js')
const question = require('./route/questionRoute.js')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

//Route
app.use('/auth', auth)
app.use('/user', user)
app.use('/folder', folder)
app.use('/topic', topic)
app.use('/word', word)
app.use('/question', question)

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Server starting at ${PORT}`)
})
