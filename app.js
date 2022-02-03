const express = require('express');
const app = express();

const path = require('path');

// npm package to connect with mongoose
const mongoose = require('mongoose');

// our model 
const {User} = require('./models/user.js');

// connecting to mongoDB
const dbUrl = 'mongodb://localhost:27017/internship' || process.env.DB_URL
mongoose.connect( dbUrl, {useNewUrlParser:true, useUnifiedTopology:true})
const db = mongoose.connection;
    db.on('error',()=>{
        console.error.bind(console,"CONNECTION ERROR :-(");
    })
    db.once('open',()=>{
        console.log("CONNECTED TO DATABASE...");
    })


// setting view engine
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));


// req body parser
app.use(express.urlencoded({extended:true}));
app.use(express.json());


// routes
app.get('/pay',async(req,res) => {
    const users = await User.find({});
    res.render('index.ejs',{users});
})

app.post('/pay',async(req,res) => {
    const {user, referrer}= req.body;
    
    const referredBy = await User.findOneAndUpdate({user:referrer},
        {
            $set:{
               isPaymentMade:true
            },
            $inc:{
                TotalEarnings:10
            }

        }    
    )
    await referredBy.save();

    const id= referredBy._id;
    const PaymentUser = await User.findOneAndUpdate({user:user},
        {
            $set:{
                ReferredUser:[id]
            }
        }
    )
    await PaymentUser.save();

    res.redirect('/pay');
});



// page not found
app.all('*',(req, res, next) => {
    res.send('404\nPAGE NOT FOUND');
});

// Listening to port 
PORT = 8080 || process.env.PORT
app.listen(PORT,()=>{
    console.log(`Listening at port ${PORT}`)
})