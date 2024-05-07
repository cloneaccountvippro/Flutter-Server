const { signUpWithEmailPasswordAndUserInfo, signUpUser, resetEmail, updatePassword } = require('./authentication/authService')
const express = require("express")
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post("/signup", async (req, res) => {
    const { email, password, fullName, age, image } = req.body;
    try {
        const userRecord = await signUpWithEmailPasswordAndUserInfo(email, password, fullName, age, image);
        res.status(200).send(userRecord);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

app.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    try {
        const userRecord = await signUpUser(email, password);
        res.status(200).send(userRecord);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

app.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    try {
        const message = await resetEmail(email);
        res.status(200).send(message);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Route to update user's password
app.post("/change-password", async (req, res) => {
    const { uid, newPassword } = req.body;
    try {
        const message = await updatePassword(uid, newPassword);
        res.status(200).send(message);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

async function saveUserInfoModel(uid, fullName, age, image) {
  try {
    // Reference to the Firebase Realtime Database
    const db = admin.database();

    // Path to the user info model node in the database
    const userInfoRef = db.ref(`userInfoModels/${uid}`);

    // Set the user info model data
    await userInfoRef.set({
      fullName: fullName,
      age: age,
      image: image
    });

    return "User info model saved successfully";
  } catch (error) {
    throw error;
  }
}

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Server starting at ${PORT}`)
})
