const express = require('express');
const userControler = require('../Controllers/userControlers.jsx');

const userRouter = express.Router();


// get all user
userRouter.get('/user', userControler.getAllUser);


module.exports = userRouter;