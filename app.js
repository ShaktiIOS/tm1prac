const express = require("express");
var bodyParser = require("body-parser");
const mongoose = require("mongoose");
const sessions=require('express-session');
var session;
const cookieParser=require("cookie-parser");
const { default: axios } = require("axios");
const res = require("express/lib/response");

/*const lib = require("./public/value");
var object = lib.obj.textContent;
console.log("hello "+object)*/

const app = express();

const oneDay=1000*60*60*24;

app.use(sessions({
    secret:"thisismysecretkey",
    saveUninitialized:true,
    cookie:{maxAge:oneDay},
    resave:false
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.set('view engine','html');
app.engine('html',require('ejs').renderFile);
app.use(bodyParser.urlencoded({
    extended:true,
}))

mongoose.connect('mongodb://localhost:27017/Tourmate',{
    useNewUrlParser:true,
    useUnifiedTopology:true
});
var uname;
var db = mongoose.connection;

db.on('error',()=>console.log("Error in connecting to database"));
db.once('open',()=>console.log("connected to database"));


app.post("/signup",(req,res)=>{
    var name = req.body.name;
    var gender = req.body.gender;
    var dob = req.body.date;
    var AGE = req.body.age;
    var age=parseInt(AGE);
    var phone = req.body.phone;
    var username = req.body.username;
    var password = req.body.password;
    var state = req.body.state;
    var city = req.body.city;

    var data = {
        "name": name,
        "gender":gender,
        "dob":dob,
        "age":age,
        "phone":phone,
        "username":username,
        "password":password,
        "state":state,
        "city":city
    }

    db.collection('users').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("record inserted successfully")
    })

})

app.post("/signin", async(req,res)=>{

    try{
         uname = req.body.username;
        var pas = req.body.password;
    
        const username=await db.collection('users').findOne({username:uname});
       // console.log(username);
        
        
      
        if(username.password === pas){
            session=req.session;
            session.userid=req.body.username;
           // console.log(req.session);

           // console.log(username.username);
            res.status(201).redirect("welcome.html");
        }
        else{
            res.status(400).send("invalid email")
        }
        
    }catch(error){
        res.status(400).send("invalid email")
    }
 

})
app.get("/find",(req,res)=>{
    res.render(__dirname+"/public/find.html");
})
app.get("/confirm",async(req, res)=> {
        try{
            let username=await db.collection('users').findOne({username:uname});
            let pprofile=await db.collection('users').findOne({name:'rajesh'});
        res.render(__dirname + "/public/conformation.html",{

      
        
        name:username.name,
         gender:username.gender,
        dob:username.dob,
        age:username.age,
         phno:username.phone,
         email:username.username,
         state:username.state,
         city:username.city,

         pname:pprofile.name,
         pgender:pprofile.gender,
        pdob:pprofile.dob,
        page:pprofile.age,
         pphno:pprofile.phone,
         pemail:pprofile.username,
         pstate:pprofile.state,
         pcity:pprofile.city
    
    });
  
}catch(error){
      res.status(400).send("No Partner availaible")
  }
});
app.post("/find",(req,res,next)=>{
    
   
      
        var state=req.body.state;
        var city=req.body.city;
        var gender=req.body.gender;
        var age=req.body.age;
      
       
       if(age==='18-30'){
            //console.log(state,city,gender,age);
            
        db.collection('users').find({$and:[{state:state},{city:city},{gender:gender},{age:{$gt:18,$lt:30}}]}).toArray(function(err,allDetails){
            
            if(err){
                    console.log(err);
                }
                else{
                    res.render(__dirname + "/public/friendlist.html",{'details':allDetails});
                }
            });
           /* function myclick(e){
                var click=e.textContent();
                console.log(click);*/
        }
       if(age==='31-50'){
        //console.log(state,city,gender,age);
        db.collection('users').find({$and:[{state:state},{city:city},{gender:gender},{age:{$gt:31,$lt:50}}]}).toArray(function(err,allDetails){
            
            if(err){
                    console.log(err);
                }
                else{
                    res.render(__dirname + "/public/friendlist.html",{'details':allDetails});
                }
            });
          
        }
       if(age==='51-70'){
        //console.log(state,city,gender,age);
        db.collection('users').find({$and:[{state:state},{city:city},{gender:gender},{age:{$gt:51,$lt:70}}]}).toArray(function(err,allDetails){
            
            if(err){
                    console.log(err);
                }
                else{
                    res.render(__dirname + "/public/friendlist.html",{'details':allDetails});
                }
            });
        }
       
    });
app.get('/pprofile',async(req,res)=>{
   
 
              try{
                let username=await db.collection('users').findOne({name:'rajesh'});
            
               
                res.render(__dirname + "/public/partnerprofile.html",{
                    
                    name:username.name,
                     gender:username.gender,
                    dob:username.dob,
                    age:username.age,
                     phno:username.phone,
                     email:username.username,
                     state:username.state,
                     city:username.city
                
                });
                
            }catch(error){
                  res.status(400).send("No Partner availaible")
              }     
                
});


app.get('/logout',(req,res)=>{
                
    req.session.destroy();
    res.render(__dirname +'/public/signin.html');
});

app.get("/profile",async(req,res)=>{
           
    
          try{
            let username=await db.collection('users').findOne({username:uname});
        
           
            res.render(__dirname + "/public/profile.html",{
                
                name:username.name,
                 gender:username.gender,
                dob:username.dob,
                age:username.age,
                 phno:username.phone,
                 email:username.username,
                 state:username.state,
                 city:username.city
            
            });
            
            
            
        
            
            
          
          }catch(error){
              res.status(400).send("No Partner availaible")
          }     
            
        
      
        
        
      });
    //   app.post("/pprofile",async(req,res)=>{
           
    
    //     try{
    //       let username=await db.collection('users').findOne({username:uname});
      
         
    //       res.render(__dirname + "/public/conformation.html",{
              
    //           name:username.name,
    //            gender:username.gender,
    //           dob:username.dob,
    //           age:username.age,
    //            phno:username.phone,
    //            email:username.username,
    //            state:username.state,
    //            city:username.city
          
    //       });
          
          
          
      
          
          
        
    //     }catch(error){
    //         res.status(400).send("No Partner availaible")
    //     }     
          
      
    
      
      
    // });

// app.get('conformation.html',(req,res)=>{
                
    
//     res.render(__dirname +'/public/conformation.html');
// });

app.get("/",(req,res)=>{
    
    session=req.session;
    if(session.userid){
        res.redirect('signup.html');
    }
    else{
        res.redirect('signup.html');
    }
   
}).listen(3000);

console.log("listening on port 3000");