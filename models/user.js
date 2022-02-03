const mongoose = require('mongoose');

const schema = mongoose.Schema

const referrerSchema= new schema({
    name:{
        type:String
    }
})

// defining our user schema as given in the internship task
const userSchema = new schema({
    user:{
        type : String,
        required : true
    },
    email:{
        type : String,
        required : true
    },
    ReferredUser:
    [
        {
        type : schema.Types.ObjectId,
        ref : 'User'  
        }
    ],
    isPaymentMade:{
        type : Boolean,
        required : true
    },
    TotalEarnings:{
        type : Number,
        required : true,
    },
    
});

// creating our user model

module.exports.User = new mongoose.model('User', userSchema);

