const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/user');

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/users", userRoutes);

// [SECTION] Database Setup
mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas.'))

// [SECTION] Server Gateway Response
if(require.main === module) {
    app.listen( process.env.PORT || 4000, () => {
        console.log(`API is now online on port ${ process.env.PORT || 4000 }`);
    })
}
module.exports = { app, mongoose };
