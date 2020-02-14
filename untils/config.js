var mongoose=require('mongoose');
// 引入邮箱的
var nodemailer=require('nodemailer');

var Mongoose={
  url:'mongodb://localhost:27017/dy',
  connect(){
    // { useUnifiedTopology: true}这个是在cmd中npm start中遇到的警告,把它填这儿,就不出现警告
    mongoose.connect(this.url,{ useUnifiedTopology: true},(err)=>{
      if(err){
        console.log("数据库连接失败");
        return;
      }
      console.log("数据库连接成功");
    });
  }
}

// 邮箱的配置
// 配置查看nodemailer的官网

var Email = {
	config : {
		host: "smtp.qq.com",
	    port: 587,
	    auth: {
        // 发件人
	      user: '1824675146@qq.com', 
	      pass: 'blxyuojavvvbdhjj'
	    }
	},
	get transporter(){
		return nodemailer.createTransport(this.config);
	},
	get verify(){
		return Math.random().toString().substring(2,6);
  },
  // 用于处理验证码时效性
  get time(){
    return Date.now();
  }
};

module.exports={
  Mongoose,
  Email
}
