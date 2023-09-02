const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let validUsers = users.filter((user) => user.username === username);
    if(validUsers.length>0)
    {
        return true;
    }
    return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let authUsers = users.filter((user) => user.username === username && user.password===password);
if(authUsers.length>0)
{
    return true;
}
return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({message: "Error logging in"});
    }
    if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
          data: password
        }, 'access', { expiresIn: 60 * 60 });
    
        req.session.authorization = {
          accessToken,username
      }
      return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
    if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }
  if (authenticatedUser(username,password)) {
    const isbn = req.params.isbn;
    let book = books[isbn]
    if (book) { 
        let review = req.body.reviews;
       
        if(review) {
            book["reviews"] = review;
        }
        books[isbn]=book;
        return res.status(300).json({message: books[isbn]});
    }
    else{
        return res.status(404).json({message: "Book is missing"});
    }
      

    
  }
  
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    // Update the code here

    let isbn = req.params.isbn;
    let book = books[isbn];
    let review = book["reviews"];
    let username = req.body.username;
  
     if(username)
     {
          delete review[username];
     }
  
      
     return res.status(208).json({message: "The review for the  ISBN "+isbn+" posted by the user "+username+" has been deleted."});
      
      
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
