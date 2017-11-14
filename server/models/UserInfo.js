var mongoose = require('mongoose');

var userInfoSchema = mongoose.Schema({
	userId : { type : String, required : '{PATH} is required!' },
	adhar :  { 
                url : String, 
                isVerified : { type : Boolean, default: false },
                verifiedBy : String
             },
    pan :  { 
                url : String, 
                isVerified : { type : Boolean, default: false },
                verifiedBy : String
             },
    cheque :  { 
                url : String, 
                isVerified : { type : Boolean, default: true },
                verifiedBy : String 
             },
	created : { type : Date, default: Date.now },
	updated : { type : Date, default: Date.now }
});

var UserInfo = mongoose.model('UserInfo', userInfoSchema);

module.exports = {
	UserInfo : UserInfo
}
