const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    //Write your code here
    return res.status(300).json({message: "Yet to be implemented"});
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
        // Send book data
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
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
