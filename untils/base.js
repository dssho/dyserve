// 密码加密
// 查看node官网
var crypto=require("crypto");

var setCrypto=(info)=>{
  return crypto.createHmac('sha256', '$%$%^jfdkf')
              .update(info)  //密码显示的信息
              .digest('hex'); //显示的格式
  
}

module.exports={
  setCrypto
}