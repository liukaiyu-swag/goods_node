var mysql=require("mysql");
var connection=mysql.createConnection({
	host:"localhost",
	user:"root",
	password:"MyNewPassword",
	database:"node"
});
module.exports=connection;
