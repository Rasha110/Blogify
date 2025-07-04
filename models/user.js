const {createHmac,randomBytes}=require('node:crypto'); //used to hash password search hash node js in ggle
const {Schema,model}=require("mongoose");
const {createTokenForUser}=require("../services/authentication.js")
const userSchema=new Schema({
    fullName:{
        type: String,
        required: true,
    },
    email:{
         type: String,
        required: true,
        unique:true,
    },
      salt:{
         type: String,
   
    },
      password:{
         type: String,
        required: true,
    },
    profileImage:{
        type:String,
        default:"/images/avatar.jpg"
    },
    role:{
        type:String,
        enum: ["ADMIN","USER"],  //only the role will be admin or user nothing else
        default: "USER"
    }
},{timestamps:true});
//whenerver u save user, then it will take current user
userSchema.pre("save",function(next){
    const user=this;
    if(!user.isModified("password")) return next();
    const salt=randomBytes(16).toString();
    const hashedPassword=createHmac('sha256',salt)
    .update(user.password)
    .digest("hex");
    this.salt=salt;
    this.password=hashedPassword;
    next();
})
    //making virtual function search mongoose virtual func in google. This func is used to check user password adn saved password.
    userSchema.static("matchPasswordAndGenerateToken", async function( email,password){
    const user= await this.findOne({email});
    if (!user)  throw new Error("User not found!");

    const salt=user.salt;
    const hashedPassword=user.password;

    const userProvidedHash=createHmac("sha256",salt)
     .update(password)
    .digest("hex");

    if(hashedPassword!==userProvidedHash) throw new Error("Incorrect Password");
   // return hashedPassword === userProvidedHash;
const token=createTokenForUser(user);
return token;
    })
const User=model('user',userSchema);
module.exports=User;