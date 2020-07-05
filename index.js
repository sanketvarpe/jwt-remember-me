const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')

const app = express()
app.use(cookieParser())

const jwtKey = 'my_secret_key'
const jwtExpirySeconds = 60
const jwtExpirySeconds2 = 180

const port = process.env.PORT || 3000;
app.set("view engine","ejs");
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var password = [];

app.get('/',(req,res)=>{
   const token = req.cookies.token
   if(!token){
   res.render('register')}
   else
   {
    var payload
    try {
      // Parse the JWT string and store the result in `payload`.
      // Note that we are passing the key in this method as well. This method will throw an error
      // if the token is invalid (if it has expired according to the expiry time we set on sign in),
      // or if the signature does not match
      payload = jwt.verify(token, jwtKey)
    } catch (e) {
      if (e instanceof jwt.JsonWebTokenError) {
        // if the error thrown is because the JWT is unauthorized, return a 401 error
        return res.status(401).end()
      }
      // otherwise, return a bad request error
      return res.status(400).end()
    }
  
    // Finally, return the welcome message to the user, along with their
    // username given in the token
    res.send(`Welcome ${payload.uname}! ur logged in automatically`)
   }
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.get('/register', (req, res) => {
    res.render('register')
})
app.post('/postreg',urlencodedParser,(req, res) => {
  password[req.body.Username] = req.body.Password
  res.render('login')
})

app.post('/postlogin',urlencodedParser,(req, res)=>{
    if(password[req.body.Username] == req.body.Password){
    if(req.body.rememberme == "on")
    {
        var uname = req.body.Username
        const token = jwt.sign({uname}, jwtKey, {
          algorithm: "HS256",
          expiresIn: jwtExpirySeconds2,
        });
        res.cookie("token", token, { maxAge: jwtExpirySeconds * 1000 });
        res.send("welcome u have been remebered for 3 min now ucan try closing site and open again within 3 minutes u will be automaticall logged in")}
    else{
        res.send("welcome")}
    }
    
  else{
      res.send("invalid credentials try again")
  }
})
app.listen(port,(res,err)=>{
    if(!err)
    {
        console.log('server started')
    }
})