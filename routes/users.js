const {Router} = require('express');

const UserController = require('../controllers/userController');
const { authenticated } = require('../middlewares/auth');

const router = new Router();



//* Login handle GET /users/login
router.get("/login",UserController.login);

//* Login page POST /users/login
router.post("/login",UserController.handleLogin,UserController.rememberMe);

//* Logout handle GET /users/login
router.get("/logout",authenticated,UserController.logout);

//* Register page GET /users/login
router.get("/register",UserController.register);

//* Register page POST /users/login
router.post("/register",UserController.createUser)





module.exports=router;