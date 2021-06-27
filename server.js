require('dotenv').config();
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');


app.use(express.json());

PORT = 5000;

// My users, can be seen as the objects inside of the db
const posts = [
    {
        username: 'sinkopeso',
        title: 'Post 1'
    },
    {
        username: 'adan',
        title: 'Post 2'
    }
]
// this are returned with a get, but the one that is returned have a condition...
// fetch app.GET in '/' and authenticateToken, if next was hit inside the middleware function (that means no returned error)
// the arrow function is gonna run and it is gonna return
// from the posts collection a JSON with the same "username" as the requested with the token
app.get('/', authenticateToken, (req, res) => {
    res.json(posts.filter( post => post.username === req.user.name));
});

// post to login
// what you post is the user to where you want to log-in
app.post('/Login', (req, res) => {
    // first save the username from the request and store it in user.name
    const username = req.body.username;
    const user = { name: username };
    
    // create an accessToken with jwt.sign
    // sign the user using the ACCESS_TOKEN_SECRET
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    // and create a response with the given accessToken for the specific
    // given user
    res.json({ accessToken : accessToken});
})

function authenticateToken(req, res, next) {
    // Bearer TOKEN
    const authHeader = req.headers['authorization']; // Authorization header stored on authHeader
    const token = authHeader && authHeader.split(' ')[1]; // if there's an authHeader split it and get the access token

    if (token == null) return res.sendStatus(401); // if no token return an error of no token

    // verify with jwt the token using the secret key
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // error unvalid or expired token
        req.user = user; // req.user is gonna be the user given by verify
        next(); // next
    })
}

app.listen(PORT, () => {
    console.log(`App listening to port ${PORT}`);
});