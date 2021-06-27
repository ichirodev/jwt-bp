const app = require('./app');
require('./database');
PORT = 3000;

async function init() {
    await app.listen(PORT, () => {
        console.log(` - - - - - - - - - - - - - - - - - - -`); 
        console.log(`|         🥓 * b a c c o n *          |`); 
        console.log(` - - - - - - - - - - - - - - - - - - -`); 
        console.log(`Server running on port ${PORT}`);
    });
}

init();