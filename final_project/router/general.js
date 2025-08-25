const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const newUsername = req.body.username;
    const newPassword = req.body.password;

    if (newUsername.length < 1 || newPassword.length < 1) {
        return res.send("Invalid username or password!");
    }

    if (!isValid(newUsername)) {
        return res.send("name already taken!");
    }

    users.push({"username": newUsername, "password": newPassword});
    res.send(`user with username ${newUsername} and password ${newPassword} has been added!`)
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    let isbn = parseInt(req.params.isbn);

    let targetBook = books[isbn];
    res.send(JSON.stringify(targetBook, null, 4));
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    let author = req.params.author;

    let targetBooks = {};

    for (let i = 1; i < Object.keys(books).length; i++) {
        if (books[i]["author"] == author) {
            targetBooks[i] = books[i];
        }
    }

    if (Object.keys(targetBooks).length > 0) {
        res.send(JSON.stringify(targetBooks, null, 4));
    }
    else {
        res.send(`No books associated with ${author}!`);
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    let title = req.params.title;

    let targetBooks = {};

    for (let i = 1; i < Object.keys(books).length; i++) {
        if (books[i]["title"] == title) {
            targetBooks[i] = books[i];
        }
    }

    if (Object.keys(targetBooks).length > 0) {
        res.send(JSON.stringify(targetBooks, null, 4));
    }
    else {
        res.send(`No books associated with ${title}!`);
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    let isbn = req.params.isbn;

    let review = books[isbn]["reviews"]

    if (review.length > 0) {
        res.send(JSON.stringify(targetBooks, null, 4));
    }
    else {
        res.send(`No review associated with isbn ${isbn}!`);
    }
});

module.exports.general = public_users;
