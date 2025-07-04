//this servuce folder is used to create json web token
const JWT=require('jsonwebtoken');
const secret="rasha908";
function createTokenForUser(user){
    const payload={
        _id:user._id,
          fullName: user.fullName,
        email:user.email,
        profileImageUrl:user.profileImageUrl,
        role:user.role,
    };
    const token=JWT.sign(payload,secret)
       // expiresIn: ''
       return token;
    
}
function validateToken(token){
    const payload=JWT.verify(token,secret);
    return payload;
}
module.exports={
    createTokenForUser,validateToken
}