// App create kar na hai 

const express = require("express")
const app = express();

// port find kar na hai
require("dotenv").config();
const PORT = process.env.PORT || 3000

// middle ware add karna hai
app.use(express.json());
const fileupload = require("express-fileupload")
app.use(fileupload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));


// db se connect kar na hai 
const db = require("./config/database")
db.connect();

// cloud se connect karna hai
const cloudinary = require("./config/cloudinary");
cloudinary.cloudinaryConnect();

// api route mount karna hai

const Upload = require("./routes/FileUpload")
app.use('/api/v1/upload' , Upload)

// activate server karna hai

app.listen(PORT , () =>{
    console.log(`App is running at ${PORT} `)
})

