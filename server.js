const express = require("express")
const app = express();
const auth = require('./route/authRoute.js')
const user = require('./route/userRoute.js')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Route
app.use('/auth', auth)
app.use('/user', user)

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Server starting at ${PORT}`)
})
