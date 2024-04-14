const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

require("dotenv").config()

const fileSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    imageUrl:{
        type:String,

    },

    tags:{
        type:String,
    },
    email:{
        type:String,
        required: true,
    }
});

// post middleware
fileSchema.post("save" , async function(doc){
     try{
        console.log("Doc" , doc);

        // transporter
        // TODO: Shift this configuration under / config folder
        let transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,

            }

        });

        // Mail send Karna
        let info = await transporter.sendMail({
            from: `Developer - by Akshay`,
            to: doc.email,
            subject:"New File Uploaded on Cloudinary",
            html: `<h2>To, Vishnu Rathod</h2> <p><p>File Uploaded View Here :  <a href="${doc.imageUrl}"> ${doc.imageUrl}</a></p>`
        })
        console.log("INFO" , info)
     }
     catch(error){
        console.error(error);

     }
})



// const File = mongoose.module("File" , fileSchema);
const File = mongoose.model("File" , fileSchema)
module.exports = File;
