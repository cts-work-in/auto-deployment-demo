const express = require('express');
const expressAsyncHandler = require("express-async-handler");
const User = require('../Models/user.jsx')


exports.getAllUser = expressAsyncHandler(async (req, res) => {
    try {
        const user = await User.find();
        if(!user){
            return res.status(201).send({status:false, message:"no user found"});
        }
        return res.status(200).send({status:true, message:"List of user", res:user});

    } catch (error) {
        
    }
});


