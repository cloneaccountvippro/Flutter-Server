const express = require('express')
const router = express.Router()
const { SignIn, SignUp, ResetPassword } = require('../service/authService.js');

router.post("/signup", async (req, res) => {
    const { email, password } = req.body;
    const userCredential = { email, password };
    try {
        const credentialId = await SignUp(userCredential);
        res.status(200).send(credentialId);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

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

// // Route to update user's password
// router.post("/change-password", async (req, res) => {
//     const { uid, newPassword } = req.body;
//     try {
//         const message = await updatePassword(uid, newPassword);
//         res.status(200).send(message);
//     } catch (error) {
//         res.status(400).send(error.message);
//     }
// });

module.exports = router
