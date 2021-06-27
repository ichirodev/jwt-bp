 const mongoose = require('mongoose');

 mongoose.connect('mongodb://localhost/sjwt', { useNewUrlParser: true, useUnifiedTopology: true })
 .then(() => {
    console.log('Database online');
 });