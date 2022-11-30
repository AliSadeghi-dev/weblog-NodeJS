const {Router} = require('express');
const {authenticated} = require('../middlewares/auth');

const router = new Router();

//* dashboardPage GET /dashboard
router.get("/",authenticated,(req,res)=>{
    res.render("dashboard",{pageTitle:"داشبورد",path:"/dashboard",layout:"./layouts/dashLayout",fullname:req.user.fullname})
})

module.exports=router;