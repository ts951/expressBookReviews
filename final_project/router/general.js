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
    // Filter books
    const filtered_books = books.filter((book) => book.author === author);

    if() {

    }
    if(filtered_books.length == 1)
    // If there is only one book with a matching author, send its data
    res.send(filtered_books);
    else {
        // If there are several books with a mtching author, send each of their data as a formatted string
        res.send(JSON.stringify(filtered_books, null, 4))
    }
    }

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
