const User = require('../models/user')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const gettAllUsers =asyncHandler( async (req,res)=>{
    const users = await User.find().select('-password').lean()
    if(!users?.length){
        return res.status(400).json({msg:'No user found'})
    }
    res.json(users)
})
const createNewUsers = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;
  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ msg: "All fields are required" });
  }
  // Check for duplicates
  const duplicate = await User.findOne({ username }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ message: 'Duplicate username' });
  }

  // Hash password
  const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

  const userObject = { username, "password": hashedPwd, roles };

  // Create and store the new user
  const user = await User.create(userObject);

  if (user) { //created
    res.status(201).json({ message: `New user ${username} created` });
  } else {
    res.status(400).json({ message: 'Invalid user data received' });
  }
});



const updateUser =asyncHandler( async (req,res)=>{
    const {id,username,roles,active,password}=req.body

    if(!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean'){
        return res.status(400).json({msg:"All firds are required"})
    }
    const user =await User.findById(id).exec()

    if(!user){
        return res.status(400).json({msg:'User not found'})
    }

    const duplicate = await User.findOne({username}).lean().exec()

    if(duplicate && duplicate?._id.toString()!==id){
        return res.status(409).json({msg:'Duplicate username'})
    }
    user.username = username
    user.roles = roles
    user.active = active

    if(password){
        user.password = await bcrypt.hash(password,10)

    }
    const updatedUser = await user.save()

    res.json({msg:`${updatedUser.username} updated`})
})


const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ msg: "User ID Required" });
    }
  
    const notes = await Note.find({ user: new mongoose.Types.ObjectId(id) }).lean().exec();
  
    if (notes?.length) {
      return res.status(400).json({ msg: 'User has assigned notes' });
    }
  
    const user = await User.findById(id).exec();
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }
  
    const result = await user.deleteOne();
    const reply = `Username ${user.username} with ID ${user._id} deleted`;
  
    res.json(reply);
  });
  
  

module.exports ={
    gettAllUsers,
    createNewUsers,
    updateUser,
    deleteUser
}