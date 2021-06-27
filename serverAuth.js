require('dotenv').config();
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

app.use(express.json());

PORT = 5000;

app.post('/token', (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);

    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken({ name: user.name });

        res.json({ accessToken: accessToken });
    });
});

let refreshTokens = [];
// post to login
// what you post is the user to where you want to log-in
app.post('/Login', (req, res) => {
    // first save the username from the request and store it in user.name
    const username = req.body.username;
    const user = { name: username };
    
    // create an accessToken with jwt.sign
    // sign the user using the ACCESS_TOKEN_SECRET
    const accessToken = generateAccessToken(user);
    // create refresh token
    const refreshToken = generateRefreshToken(user);
    // and create a response with the given accessToken for the specific
    // given user

    // store refresh token
    refreshTokens.push(refreshToken);
    // return tokens on json
    res.json({ accessToken : accessToken, refreshToken: refreshToken});
});

app.delete('/Logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => {
        token !== req.body.token;
    });
    res.sendStatus(204);
});

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m'});
}

function generateRefreshToken(user) {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
}

app.listen(PORT, () => {
    console.log(`App listening to port ${PORT}`);
});