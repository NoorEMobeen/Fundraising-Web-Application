const express = require('express');
const cors = require('cors');
const admin=require('./config/firebaseConfig');
const app = express();
// const csrf =require('csrf');
const {urlencoded}=require('body-parser');
const bodyParser = require('body-parser');
const { encrypt } = require('./config/easypaisa/Easypaisa');
const { STRIPE_PRIVATE_KEY } = require('./config/stripe/secrets');

app.use(bodyParser.json());
app.use(urlencoded({extended:true}));
// const cookieParser=require('cookie-parser');


app.use(cors());

require('./routes/donor_routes')(app);
require('./routes/new_student_routes')(app);
require('./routes/admin_routes')(app);

{
//const csfrMiddleware=csrf({cookie:true});

//Body Parser Middleware
//app.use(express.json());
//app.use(express.urlencoded({extended:false}));

//app.use(cookieParser());
//app.use(csfrMiddleware);

//Additional Permission Access Control Middleware
// app.use(function (req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//   res.setHeader('Access-Control-Allow-Credentials', true);
//   next();
//   });

// app.all("*",(req,res,next)=>{
//     res.cookie("XSRF-TOKEN",req.csrfToken)
//   })

// app.post('/sessionLogin',(req,res)=>{
//   const idToken=req.body.idToken.toString()
//   const expiresIn=60*60*1000

//   admin.createSessionCookie(idToken,{expiresIn})
//   .then((sessionCookie)=>{
//     const options={maxAge:expiresIn,httpOnly:true}
//     res.cookie("session",sessionCookie,options);
//     res.end(JSON.stringify({status:"success"}))
//   },
//   (error)=>{
//     res.status(401).send("Unauthorized request");
//   }
//   )
// })
}

app.get('/login',(req,res)=>{
  if(req.headers.authorization.split(' ')[0]=='afs'){
    return res.json({errorMessage:'Internal Server ERROR: Role is not set'});
  }
  const currentRole=req.headers.authorization.split(' ')[0];
  //try{
    admin.auth().verifyIdToken(req.headers.authorization.split(' ')[1])
    .then((decodeValue)=>{
      //console.log(decodeValue);
    if(decodeValue){
      const ref=admin.database().ref("roles/"+currentRole+"/"+decodeValue.uid);

      ref.once('value', (snapshot) => {
        if(snapshot.hasChildren()){
          return res.json({successMessage:"User Exists in selected role"+JSON.stringify(snapshot.val())});
        }
        else{
          return res.json({errorMessage:"User DOES NOT exists in selected role"+JSON.stringify(snapshot.val())});
        }
      }, (errorObject) => {
        return res.json({errorMessage:"User DOES NOT exists in selected role"});
      }); 
    }
    });
    
    //return res.json({errorMessage:'Unauthorized User'});
//} catch(e){
 //   return res.json({errorMessage: 'Internal ERROR'});
//}
  
});

//Application Routes Redirection
// app.use('/student',require('./routes/student_routes'));
// app.use('/donor',require('./routes/donor_routes'));
// app.use('/admin',require('./routes/admin_routes'));
//app.use('/',require('./routes/routes'));

app.get('/',(req,res)=>{
  
  return res.send("It is response from AFS");
});

app.post('/encrypt',encrypt);



////Payment gateway 
//app.use(express.json())
require('dotenv').config()
const stripe=require('stripe')(STRIPE_PRIVATE_KEY)


app.post("/create-donation-session", async (req, res) => {
  if(!req.body){
    console.log('body is undefined')
    return
  }
  let {docId, amount, uid, RequestTitle, DeadlineDay, RequestUID}=req.body
  if(!docId || !amount || !uid || !RequestTitle || !DeadlineDay || !RequestUID){
    return res.status(400).send({errorMessage:'Invalid data sent to server'})
  }
  RequestTitle=RequestTitle.replace(/ /g,';');
  // const storeItems = new Map([
  //   [uid, { price: amount, name: RequestTitle }]
  // ])
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [{
        price_data: {
          currency: "PKR",
          product_data: {
            name: RequestTitle,
          },
          unit_amount: (amount*100),
        },
        quantity: 1,
      }],
      success_url: `http://localhost:3000/success/${docId}_${amount}_${uid}_${RequestTitle}_${DeadlineDay}_${RequestUID}`,
      cancel_url: `http://localhost:3000/cancel`,
    })
    res.send({ url: session.url })
  } catch (e) {
    console.log(e.message)
    res.send({ error: e.message })
  }
})

app.post("/create-withdraw-session", async (req, res) => {
  if(!req.body){
    console.log('body is undefined')
    return
  }
  let {stripeKey,Amount,uid,RequestTitle,DeadlineDay,created_at,docId}=req.body
  if(!Amount || !uid || !RequestTitle || !DeadlineDay || !created_at || !docId){
    return res.status(400).send({errorMessage:'Invalid data sent to server'})
  }
  if(Amount<100){
    return res.send({errorMessage:'Withdraw amount must be at least Rs 1000/-'})
  }
  RequestTitle=RequestTitle.replace(/ /g,';');
  // const storeItems = new Map([
  //   [uid, { price: amount, name: RequestTitle }]
  // ])
  try {
    const stripeWithdraw=require('stripe')(stripeKey)
    const session = await stripeWithdraw.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [{
        price_data: {
          currency: "PKR",
          product_data: {
            name: RequestTitle,
          },
          unit_amount: (Amount*100),
        },
        quantity: 1,
      }],
      success_url: `http://localhost:3000/withdraw-success/${Amount}_${uid}_${RequestTitle}_${DeadlineDay}_${created_at}_${docId}`,
      cancel_url: `http://localhost:3000/withdraw-cancel`,
    })
    res.send({ url: session.url })
  } catch (e) {
    console.log(e.message)
    res.send({ error: e.message })
  }
})


///////////////////




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => `Server running on port ${PORT}`);

module.exports =app;
