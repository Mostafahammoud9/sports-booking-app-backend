const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 5000;

const app = require('./app');

const db = require('./config/db');

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});

