const express = require('express')
const router = express.Router()
const { SignIn, SignUp, ResetPassword } = require('../service/authService.js');
const { saveUserData } = require('../service/userService.js');

// router.post("/signup", async (req, res) => {
//     const { email, password } = req.body;
//     const userCredential = { email, password };
//     try {
//         const credentialId = await SignUp(userCredential);
//         res.status(200).send(credentialId);
//     } catch (error) {
//         res.status(400).send(error.message);
//     }
// });

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    const userCredential = { email, password };
    try {
        const userRecord = await SignIn(userCredential);
        res.status(200).send(userRecord);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post("/reset-password", async (req, res) => {
    const { email } = req.body;
    try {
        console.log(email)
        const message = await ResetPassword(email);
        res.status(200).send(message);
    } catch (error) {
        res.status(400).send(error.message);
    }
})

router.post("/signup", async (req,res) => {
    const { email, password } = req.body;
    const userCredential = { email, password };
    const {fullName, age, gender} = req.body;
    const userInfoModel = {fullName, age, gender}
    try {
        const credentialId = await SignUp(userCredential);
        await saveUserData(credentialId, userInfoModel)
        res.status(200).send(credentialId);
    } catch (error) {
        throw error
    }
})


module.exports = router
