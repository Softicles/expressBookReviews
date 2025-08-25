const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let authorization = {};

let users = [];

const isValid = (username) => { //returns boolean
    let potentialUser = users.filter(user => user.username === username);

    if (potentialUser.length > 0) {
        return false;
    }
    return true;
}

const authenticatedUser = (username, password) => { //returns boolean
    let validUsers = users.filter(user => user.username === username && user.password === password);

    if (validUsers.length > 0) {
        return true;
    }
    return false;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({ data: password }, "access", { expiresIn: 60 * 60 });
        authorization["accessToken"] = accessToken;
        req.session.save();
        return res.status(200).send(`User ${username} successfully logged in`);
    }
    return res.status(208).json({ message: "Invalid login: Check username and password" });

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let isbn = parseInt(req.params.isbn);
    const review = req.body.review;
    const username = req.body.username;

    let book = books[isbn];
    if (book) {
        book.reviews[username] = review;
        res.send(`Review ${review} from ${username} has been added`);
    } else {
        res.send("Unable to add review!");
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn = parseInt(req.params.isbn);
    const username = req.body.username;
    let review = books[isbn]["reviews"][username]

    if (review) {
        delete books[isbn]["reviews"][username];
    }
    res.send(`Review with the user ${username} is deleted`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.authorization = authorization;
