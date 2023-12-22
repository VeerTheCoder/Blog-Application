const express = require('express');
const { getAllUsers, registerController, loginController } = require('../controllers/userController');

const router=express.Router();

router.get('/get-users',getAllUsers);

router.post('/register',registerController);

router.post('/login',loginController);

module.exports=router;