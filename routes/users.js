var express = require('express');
var router = express.Router();
var path=require('path');
var fs=require('fs');
var multiparty=require('multiparty');
var form=new multiparty.Form();
var mysql=require('./mysql.js');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(process.cwd(),"views","add.html"));
});
router.post('/save',function(req,res){
//	form.encoding="utf-8";
	form.uploadDir = "public/img/";
	form.keepExtensions = true;
	form.parse(req,function(err,fields,files){
		var oldPath=files.pic[0].path;
		var newPath=(new Date().getTime()+Math.floor(Math.random())*1000)+path.extname(oldPath);
		fs.rename(oldPath,"public/img/"+newPath,function(err){
			if(!err){
				mysql.query(`insert into goods (name,price,stock,src,info) values ('${fields.name[0]}','${fields.price[0]}','${fields.stock[0]}','${newPath}','${fields.info[0]}')`,function(err,result){
					if(result.affectedRows>0){
						res.redirect("/");
					}
				});
			}
		});
	});
})
module.exports = router;
