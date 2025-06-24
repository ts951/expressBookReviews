const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    // Check if user is logged in and has a valid token
    if(req.session.authorisation) {
        // Get the JWT token
        let token = req.session.authorisation['accessToken'];

        // Verify JWT
        jwt.verify(token, "access", (err, user) => {
            if(!err) {
                req.user = user;
                next(); // Go to next middleware
            }
            else {
                // If JWT not valid, display error message
                return res.status(403).json({message: "User not authenticated."});
            }
        });
    }

    else {
        // If user is not logged in
        return res.status(403).json({message: "User not logged in"});
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
