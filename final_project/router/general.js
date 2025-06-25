const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Function to check if username already exists or not
const doesUsernameExist = (username) => {
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

public_users.post("/register", (req,res) => {
    // Extract username and password from body of request
    const username = req.body.username;
    const password = req.body.password;

    // Check if username and/or password is valid, if not, return appropriate error message
    if (!username && !password) {
        return res.status(403).json({message: "No username or password provided"});
    }
    else if (!username) {
        return res.status(403).json({message: "No username provided"});
    }
    else if (!password) {
        return res.status(403).json({message: "No password provided"});
    }
    
    if (!doesUsernameExist(username)) {
        // If username does not already exist, create user data inside users array
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User successfully registered"});
    }
    else {
        // If username does already exist, return error message
        return res.status(404).json({message: "User already exists"});
    }

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    // Send entire formatted book list
    res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    // Extract isbn from request parameters
    const isbn = req.params.isbn;
    // Get corresponding book data
    const book = books[isbn];
    if (book) {
        // Send book data if valid
        res.send(book);
    }
    else {
        res.status(403).json({message: "Not a valid ISBN"});
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    // Extract author from request parameters
    const author = req.params.author;

    for (const isbn in books) {
        // For each book, check if the author matches the requested author
        if (books[isbn].author === author) {
            // Send the data of the first book with a matching author and return
            res.send(books[isbn]);
            return;
        }
    }

    // If no books with a matching author are found, show error message
    res.status(403).json({message: "No books with that author"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    // Extract title from request parameters
    const title = req.params.title;

    for (const isbn in books) {
        // For each book, check if the title matches the requested title
        if (books[isbn].title === title) {
            // Send the data of the first book with a matching title and return
            res.send(books[isbn]);
            return;
        }
    }

    // If no books with a matching title are found, show error message
    res.status(403).json({message: "No books with that title"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    // Extract isbn from request parameters
    const isbn = req.params.isbn;
    // Get corresponding book data
    const book = books[isbn];

    if(book) {
        // If book is valid, send reviews data for said book
        res.send(books[isbn].reviews);
    }
    else {
        // Otherwise, send error message
        res.status(403).json({message: "Not a valid ISBN"});
    }
});

module.exports.general = public_users;
