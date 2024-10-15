const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const cookieParser = require('cookie-parser');
const userRoutes = require("./routes/userRoute");
const googleRoutes = require("./routes/googleRoute");


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(express.static('./public'));
app.use('/images', express.static(path.join(__dirname, '/public/images')));

//multer
//use of multer package
let storage = multer.diskStorage({
  destination :(req, file, cb)=>{
      cb(null, './public/images')
  },
  filename:(req, file, cb)=>{
    console.log(file);
      cb(null, file.originalname )
  }
})

let maxSize = 2 * 1000 * 1000;
let upload = multer({
  storage : storage,
  limits : {
      fileSize : maxSize
  }
});

let uploadHandler = upload.single('file');

app.post('/upload', (req,res)=>{
  uploadHandler(req, res, function(err){
      if(err instanceof multer.MulterError){
          if(err.code == 'LIMIT_FILE_SIZE'){
              res.status(400).json({message : "Maximum file size is 2mb."})
          }
          return;
      }

      if(!req.file){
          res.status(400).json({message : "No file!"});
      }else{
          res.status(200).json( {message : "Uploaded to the Server!"})
      }
  })
})



// Log responses
app.use((req, res, next) => {
  console.log(`Path: ${req.path} | Method: ${req.method}`);
  next();
});

// Routes
app.use("/api/v1",userRoutes)
app.use('/api/v1/google', googleRoutes);

// DB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to database!");
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Connection failed!", error);
  });
