const express = require('express');
const multer = require('multer');
const fs = require('fs');

const port = 3000;
const app = express();

const uploaded_files = [];
//var path    = require("path");
var storage = multer.diskStorage({
  
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/') 
  },
  filename: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null,Date.now()  + '-' + file.originalname)
  }
});
var upload = multer({storage: storage});
app.use(express.static('public'));
app.use(express.static('./public/uploads/'));
app.use(express.static('./public/static/'));

app.get('/home', (req, res, next)=> {
    const path = 'public/uploads/';
    fs.readdir(path, function(err, items) {
    console.log(items);
    items.sort(function(a, b) {
      return fs.statSync(path + b).mtime.getTime() - 
             fs.statSync(path + a).mtime.getTime();
  });  
   var images='';
   for (var i=0; i<items.length; i++) {
    images += `<img src="${items[i]}" class="galleria"> 
               <br>`;
  }
    var htmlContent = `<head>
    <link rel="stylesheet" href="index.css">
    </head>
    <body>
        <h1 class='headingclass'>Kenziegram</h1>
        <form action="http://localhost:3000/upload" method="post" enctype="multipart/form-data">
            <div>
              <label for="myfile">Select a file to upload</label>
              <input type="file"  name="myfile" id="myfile">
              <button type="submit">Upload</button>
            </div>
        </form>
        
        ${images}
        </body>
    `;
     res.send(htmlContent);
    });
  })

app.post('/upload', upload.single('myfile'), function (req, res, next) {
    // req.file is the `myfile` file
    // req.body will hold the text fields, if there were any
  console.log("Uploaded: " + req.file.filename);
  uploaded_files.push(req.file.filename);
   
  var htmlContent = ` <link rel="stylesheet" href="index.css">
  <h1 class='headingclass'>Kenziegram</h1>
  <p>File successfully uploaded!</p>
  <a href="http://localhost:3000/home">Go back</a>
  <img src="${ req.file.filename} " class="galleria">`
  
   res.send(htmlContent);
})  
app.listen(port);