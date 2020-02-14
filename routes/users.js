var express = require('express');
// 引入contoller
var usersController=require('../controllers/users.js');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// 登录  post
router.post('/login',usersController.login);
// 注册
router.post('/register',usersController.register);
// 邮箱验证
router.get('/verify',usersController.verify);
// 退出
router.get('/logout',usersController.logout);
// 
router.get('/getUser',usersController.getUser);
// 
router.post('/findPassword',usersController.findPassword);




module.exports = router;
