var mongoose=require('mongoose');
// 让UserSchema中的index:{unique:true}生效
mongoose.set('useCreateIndex',true);

// 注册
var UserSchema=new mongoose.Schema({
  // required:true是否为空
  username:{type:String,required:true,index:{unique:true}},
  password:{type:String,required:true},
  email:{type:String,required:true,index:{unique:true}},
  date:{type:Date,default:Date.now()},
  // 是否为管理员
  isAdmin:{type:Boolean,default:false},
  // 操作  冻结
  isFreeze:{type:Boolean,default:false}
});

var UserModel=mongoose.model('user',UserSchema);
UserModel.createIndexes();



// 添加数据库
var save=(data)=>{
   var user=new UserModel(data);
  return user.save()
     .then(()=>{
       return true;
     })
     .catch(()=>{
       return false;
     });
};


// 登录
var findLogin=(data)=>{
  return UserModel.findOne(data);
}

// 修改密码
var findPassword=(email,password)=>{
  return UserModel.update({email},{$set:{password}})
  .then(()=>{
    return true;
  })
  .catch(()=>{
    return false;
  })
}


// 用户列表
var userList=()=>{
  return UserModel.find();
}

// 更新冻结状态
var updateFreeze=(email,isfreeze)=>{
  return UserModel.update({email},{$set:{isfreeze}})
  .then(()=>{
    return true;
  })
  .catch(()=>{
    return false;
  });
}

// 删除
var deleteUser=(email)=>{
  return UserModel.deleteOne({email});
}

module.exports={
  save,
  findLogin,
  findPassword,
  userList,
  updateFreeze,
  deleteUser
};