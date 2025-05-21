const { SignUp, LogIn } = require('../controllers/authComponents');
const {userList, singleUser, editUser, deleteUser, updatePaswword} = require('../controllers/userComponets');
const {validateSignup, validateLogin, updateUser, updatePassword}= require('../middleware/validateInput');
const verifyToken = require('../middleware/verifyToken');

const route=require('express').Router();

route.post('/signUp', validateSignup, SignUp);
route.post('/login', validateLogin, LogIn);
route.get('/users', userList);
route.get('/profile', verifyToken, singleUser);
route.put('/edit', verifyToken, updateUser, editUser);
route.put('/updatePassword', verifyToken, updatePassword, updatePaswword);
route.post('/delete', verifyToken, deleteUser);


module.exports=route