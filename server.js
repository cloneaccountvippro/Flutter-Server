const express = require("express")
const app = express();
const auth = require('./route/authRoute.js')
const user = require('./route/userRoute.js')
const folder = require('./route/folderRoute.js')
const topic = require('./route/topicRoute.js')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Route
app.use('/auth', auth)
app.use('/user', user)
app.use('/folder', folder)
app.use('/topic', topic)

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Server starting at ${PORT}`)
})
