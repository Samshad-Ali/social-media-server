const express = require('express');
const dotenv = require('dotenv');
// dotenv.config({path:'./.env'})
dotenv.config('./.env')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const db = require('./DBconnect')
const app = express();
const mainRouter = require('./routes/router');
const bodyParser = require('body-parser');
const cors = require('cors');
// ------------------- Corse
app.use(cors({
    credentials:true,
    origin:'http://localhost:3000'
    // it means that only this origin have the access of this backend.
}))
 // there is a term come => CORS (Cross Origin Resource Sharing);
// due to cors the backend will not accept the frontend request as they share on different location or IP address

// ----------- cloudinary---------------
// cloudinary is basically to store image file even you can modify the image too.
const cloudinary = require('cloudinary').v2;
cloudinary.config({ 
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
  api_key:process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

//----------- middleware
app.use(express.json({limit:'20mb'}));
app.use(morgan('common'));
// app.use(bodyParser.json({limit:'20mb'}));
// ----------------- cookies
app.use(cookieParser())
// cookie are something which used to store the data like token etc. on the frontend from backend.
// it is the update of information that used by server that , this man is from the actual source or not..
// cookie only set by the backend by you.

app.get('/',(req,res)=>{
    res.send('hello')
})
app.use('/api',mainRouter)

db();
const port = process.env.PORT;
app.listen(port,()=>{
    console.log(`Listening on the Port ${port}`)
})

