const { Router } = require('express');
const router = Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const verifyToken = require('./verifyToken');

require('dotenv').config();

router.post('/signin', async (req, res, next) => {
    const { email, password } = req.body;
    const u = await User.findOne({ email: email });

    if (!u) return res.status(404).send('Entered email does not exists');

    const passwordIsValid = await u.validatePassword(password);

    if (!passwordIsValid) {
        return res.status(401).json({auth: false, token: null});
    }

    let date = new Date;
    let dateMonth = date.getUTCMonth() + 1;
    let dateNow = date.getUTCDate().toString() + "/" + dateMonth.toString() + "/" + date.getUTCFullYear().toString() + ", " + date.getUTCHours().toString() + ":" + date.getUTCMinutes().toString();

    const token = jwt.sign({id: u._id}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '8h'});
    
    console.log(`💻 ${email} authenticated: signed-in at UTC ${dateNow}`);
    
    res.json({auth: true, token});
});

router.post('/signup', async (req, res, next) => {
    const { email, password} = req.body;

    const user = new User ({
        email: email,
        password: password
    });

    user.password = await user.encryptPassword(user.password);
    
    let token = jwt.sign({id: user._id}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '8h' });

    await user.save();

    storeToken(token);

    res.json({auth: true, token});
});

router.get('/me', verifyToken, async (req, res, next) => {
    const u = await User.findById(req.userId, { password: 0 });
    
    if (!u) return res.status(404).send('No user found');

    res.json(u);
});

module.exports = router;