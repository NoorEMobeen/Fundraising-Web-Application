const firebase =require('../config/firebaseConfig')
const express =require('express');
const router = express.Router();



router.post('/login',(req,res)=>{
  if (req.method == 'POST') {
      var body = '';

      req.on('data', function (data) {
          body += data;

          // Too much POST data, kill the connection!
          // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
          if (body.length > 1e6)
              req.connection.destroy();
      });
      var email='';
      req.on('end', function () {
          var post = qs.parse(body);
          // use post['blah'], etc.
          email=post.email;
      });

      firebase.auth.getUserByEmail(email)
          .then(()=>{
            res.status(200);
            res.send("User Login Successful");
          })
          .catch(()=>res.send('Unexpected error occured!'));
  }

  /////////////////////////
  // const customers = [
  //   {id: 1, firstName: 'John', lastName: 'Doe'},
  //   {id: 2, firstName: 'Brad', lastName: 'Traversy'},
  //   {id: 3, firstName: 'Mary', lastName: 'Swanson'},
  // ];

  // res.json(customers);
});




{
/////////////
// router.get('/login',(req,res)=>{
//     res.send('<h1>Hello from Login</h1>');
// });
// router.post('/login',(req,res)=>{
//     res.send('<h1>Hello from Login POST</h1>');
// });
// router.get('/signup',(req,res)=>{
//     res.send(req.body);
// });
// router.post('/signup',(req,res)=>{
//   console.log("Inside signup auth.routes.js",req.body.email, req.body.password);
//     // [START auth_signup_password]
//     auth.createUserWithEmailAndPassword(req.body.email, req.body.password)
//     .then((userCredential) => {
//       // Signed in 
//       //var user = userCredential.user;
//       console.log('User Signed up successfully');
//       return res.json();
//       // ...
//     })
//     .catch((error) => {
//       var errorCode = error.code;
//       var errorMessage = error.message;
//       console.log('User Signed up Error',errorCode,errorMessage);
//       return res.json();
//       // ..
//     });
//     // [END auth_signup_password]
//     // if(user.signUpWithEmailPassword(req.email,req.password)){
//     //     res.send('<h1>Hello from Signup Success</h1>');
//     // }
//     // else{
//     //     res.send('<h1>Hello from Signup Failure</h1>');
//     // }
// });
// router.get('/forgot_password',(req,res)=>{
//     res.send('<h1>Hello from forgot_password</h1>');
// });
/////////////
}

module.exports=router;