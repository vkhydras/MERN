const express = require ('express')
const router = express.Router()
const usersController = require('../controllers/userControllers')

router.route('/')
    .get(usersController.gettAllUsers)
    .post(usersController.createNewUsers)
    .patch(usersController.updateUser)
    .delete(usersController.deleteUser)

module.exports = router