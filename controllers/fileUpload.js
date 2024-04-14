const File = require("../models/File");
const cloudinary = require("cloudinary").v2;

/// localfileuploads -> handler function 

exports.localFileUpload = async (req , res) =>{
    try{
        // First fetch the file
        const file = req.files.file
        console.log("File aagyi " , file);

        let path = __dirname + "/files" + Date.now() + `.${file.name.split('.')[1]}` ;
        console.log("Path ->" , path)
        // server ka path hai
        file.mv(path , (err) =>{
            console.log(err);
        })
        res.json({
            success: true,
            message:"Local file uploaded Successfully"
        })

    }
    catch(error){
        console.log("Not able to upload the files on the server")
        console.log(error)

    }

}

// The above code is of the first day

function isFileTypeSupported( type , supportedType) {
    return supportedType.includes(type);
}

async function uploadFileToCloudinary(file , folder , quality){ 
    const options = {folder}
    console.log("temp file path", file.tempFilePath)
    if(quality){
        options.quality = quality
    }

    
    options.resource_type = "auto";
    return await cloudinary.uploader.upload(file.tempFilePath, options);

}

// image upload ka handler

exports.imageUpload = async (req , res) =>{
    try{
        // data fetch 
        const{ name  , tags , email} = req.body;
        console.log(name , tags , email);

        // last file ka naam aata hai , wo uski key ko dikhata hai
        const file = req.files.imageFile;
        console.log(file);

        /// Validation 
        const supportedType = ["jpg" , "jpeg" , "png"];
        const fileType = file.name.split(".")[1].toLowerCase();

        if(!isFileTypeSupported(fileType , supportedType)){
            return res.status(400).json({
                success:false,
                message:"File format not supported"
            })
        }

        // file format supported
         const response = await uploadFileToCloudinary(file, "Rathod")
        console.log(response)


         // db me entry save karna hai
         const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl:response.secure_url,
         })

        res.json({
            success:true,
            imageUrl:response.secure_url,
            message:"Image is successfully uploaded"
        })

    }
    catch(error){
        res.status(400).json({
            status:false,
            message:"Something went wrong"
        })

    }
}

exports.videoUpload = async (req , res) => {
    try{
        // data fetch 
        const{name , email , tags} = req.body;
        console.log(name , tags , email);

        // last file name
        const file = req.files.videoFile;

        // validation 
        const supportedType = ["mp4" ,"mov"];
        const fileType = file.name.split('.')[1].toLowerCase();
        console.log("File Type" , fileType);

            // add a upper limit upto 5mb
        if(!isFileTypeSupported(fileType, supportedType)){
            return res.status(400).json({
                success:false,
                
                message:"File format is not  Supported"
            })
        }

        // file format support hai , aur cloudinary pe upload kar na hai
        console.log("Upload on the Rathod")
        const response = await uploadFileToCloudinary(file, "Rathod");
        console.log(response);

        // db mai entry create karni hai..
        const fileData = await File.create({
            name ,
            tags,
            email,
            imageUrl:response.secure_url,

        });

        res.json({
            success:true,
            imageUrl:response.secure_url,
            message:"Video Successfully Uploaded"
        })

    }
    catch(error){
        console.log(error);
        res.status(400).json({
            success:false,
            message:"Something went wrong"
        })
    }
}

exports.imageSizeReducer = async (req, res) =>{
    try{
        const {name , email , tags} = req.body;
        console.log(name , email , tags)
    
            // last file name
        const file = req.files.imageFile;
        console.log(file)

        // Validation  
        const supportedType = ["jpg" , "jpeg" , "png"];
        const fileType = file.name.split('.')[1].toLowerCase();
        console.log("File Type =>" , fileType)

        if(!isFileTypeSupported( fileType , supportedType)){
            return res.json({
                success:false,
                message:"This file is not Supported"
            })
        }

        // file format Supported
        console.log("Upload to the Rathod");
        const response = await uploadFileToCloudinary(file, "Rathod",30);
        console.log(response);

        // db mai entry create karna hai
        const fileData = await File.create({
            name,
            email,
            tags,
            imageUrl : response.secure_url,
        })

        res.json({
            success:true,
            imageUrl: response.secure_url,
            message:"Image uploaded Successfully"
        })

    }
    catch(error){
        console.error(error);
        res.status(400).json({
            success:false,
            message:"Something went wrong"
        })

    }
}