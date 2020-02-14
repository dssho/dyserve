// 引入配置
var {Email} =require('../untils/config.js');
// 引入注册
var UserModel=require('../models/users.js');
// 加密
var {setCrypto}=require('../untils/base.js');

// 采用异步
var login=async(req,res,next)=>{
  var {username,password}=req.body;
  // 从models/users.js中得到结果
  var result=await UserModel.findLogin({
    // 然后把用户名和密码传过去
    username,
		password:setCrypto(password)
  });
  if(result){
    req.session.username=username;
    //是否为管理员
    req.session.isAdmin=result.isAdmin; 
    
    // 
    if(result.isFreeze){
      res.send({
        msg : '账号已冻结',
        status : -2
      });
    }else{
      res.send({
        msg : '登录成功',
        status : 0
      });
    }
  }else{
    res.send({
			msg : '登录失败',
			status : -1
		});
  }

}

var register = async (req,res,next)=>{
	 // 用户名.密码.邮件,验证码
	var { username , password , email , verify } = req.body;

	if( email !== req.session.email || verify !== req.session.verify ){
		res.send({
			msg : '验证码错误',
			status : -1
    });	
    return;
  }
  if((Email.time-req.session.time)/1000>60){
    res.send({
      msg:'验证码已过期',
      status:-3
    });
    return;
  }

	var result = await UserModel.save({
		username,
		password:setCrypto(password),
		email
	});

	if(result){
		res.send({
			msg : '注册成功',
			status : 0
		});
	}
	else{
		res.send({
			msg : '注册失败',
			status : -2
		});
	}


};
// 验证码
var verify=async(req,res,next)=>{
  var email=req.query.email;
  // 得到的验证码
  var verify=Email.verify;
  

  req.session.verify=verify;
  // 要保证验证码和邮箱是匹配的
  req.session.email=email;
  // 本是保存在内存中，设置它保存在本地或使用redis
  // redis数据缓存
  req.session.time=Email.time;


  // 要发送的字段,参照nodemailer官网
  var mailOptions = {
    from: '电影网 1824675146@qq.com',
    to: email,
    subject: '电影网邮箱验证码',
    text: '验证码：' + verify
  }
  Email.transporter.sendMail(mailOptions,(err)=>{
		
		if(err){
			res.send({
				msg : '验证码发送失败',
				status : -1
			});
		}
		else{
			res.send({
				msg : '验证码发送成功',
				status : 0
			});
		}

	});

}
var logout=async(req,res,next)=>{
  req.session.username="";
  res.send({
    msg:'退出成功',
    status:0
  })
}
var getUser=async(req,res,next)=>{
  if(req.session.username){
    res.send({
      msg:'获取用户信息成功',
      status:0,
      data:{
        username:req.session.username,
        isAdmin:req.session.isAdmin
      }
    });
  }else{
    res.send({
      msg:'获取用户信息失败',
      status:-1,
    });
  }
}
var findPassword=async(req,res,next)=>{
  var {email,password,verify}=req.body;
  if(email==req.session.email&&verify==req.session.verify){
    var result=await UserModel.findPassword(email,setCrypto(password));
    if(result){
      res.send({
        msg:'修改密码成功',
        status:0
       });
    }
    else{
      res.send({
        msg:'修改密码失败',
        status:-1
       });
    }
  }
  if((Email.time-req.session.time)/1000>60){
    res.send({
      msg:'验证码已过期',
      status:-3
    });
    return;
  }
  else{
    res.send({
     msg:'验证码失败',
     status:-1
    });
  }
}

module.exports={
  login,
  register,
  verify,
  logout,
  getUser,
  findPassword
};