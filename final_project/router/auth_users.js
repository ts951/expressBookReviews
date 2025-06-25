const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const doesUsernameExist = (username)=>{ //returns boolean
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Check if username and password match the one in records.
const authenticatedUser = (username,password)=>{ //returns boolean
    // Filter array to store user that matches the provided username and password
    let authenticatedUser = users.filter((user) => user.username === username && user.password === password);

    // Check if user exists by checking authenticatedUser has a a length greater than 0
    if (authenticatedUser.length > 0) {
        // if user exists return true
        return true;
    }
    else {
        // If user does not exist return false
        return false;
    }

}

//only registered users can login
regd_users.post("/login", (req,res) => {
    // Extract username and password used to login from request body
    const username = req.body.username;
    const password = req.body.password;

    if (authenticatedUser(username, password)) {
        // Generate JWT for authenticated user having logged in
        let accessToken = jwt.sign({data: password}, 'access', {expiresIn: 60*60});

        // Store access token and username in session
        req.session.authorisation = {accessToken, username};

        // Send success message
        return res.status(200).send({message: "User successfully logged in"});
    }
    else {
        // Send error message if username and/or password are incorrect
        return res.status(401).json({message: "Invalid login details. Please check username and password"})
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    // Extract isbn of book to review from request parameters and review from request query
    const isbn = req.params.isbn;
    const review = req.query.review;

    // Extract the username from the session
    const username = req.session.authorisation["username"];
    
    // Get the reviews section of the book in question using the isbn
    const reviews = books[isbn].reviews;

    if (reviews) {
        // If reviews exists, the isbn was valid, so update or add the review and update the books object
        reviews[username] = review;
        books[isbn].reviews = reviews;
        return res.status(200).json({message: "Thank you for your review"});
    }

    else {
        // If book isbn is not valid, send error message
        return res.status(403).json({message: "Not a valid ISBN"});
    }
});

module.exports.authenticated = regd_users;
module.exports.doesUsernameExist = doesUsernameExist;
module.exports.users = users;
