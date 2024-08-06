const express = require('express');
const authControler = require('../Controllers/authControlers.jsx');

const authRouter = express.Router();
// signup route 
authRouter.post('/signup', authControler.Register);


module.exports = authRouter;