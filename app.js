const express = require('express')
const app = express()
const nodemailer = require('nodemailer')
const multer = require('multer')
const fs = require('fs')

const storage = multer.diskStorage({
    destination : function(req, file , cb) {
        if(!fs.existsSync(__dirname+'/temp')) {
            fs.mkdirSync(__dirname+'/temp')
        } 
        cb(null , './temp')
    },
    filename : function(req,file , cb) {
        cb(null , file.originalname)
    }
}) 

const upload = multer({storage : storage})
const transporter = nodemailer.createTransport({
    host : 'smtp.gmail.com',
    port: '465',
    sender : 'gmail',
    auth : {
        user : 'ndyusembekov07@gmail.com',
        pass : 'Hello, Nurlan!'
    }
})
app.get('/sendEmail' ,upload.array('attachments') ,  (req,res) => {
    let attachments = []
    for(let i = 0; i<req.files.length; i++) {
        let fileDetails = {
            filename : req.files[i].filename,
            path: req.files[i].path
        }
        attachments.push(fileDetails)
    }
var mailOptions = {
    from : 'ndyusembekov07@gmail.com',
    to : 'ndyusembekov07@gmail.com',
    subject : 'Sending mail using nodejs',
    html : '<h1>Hello world</h1>' , 
    attachments : attachments
}

transporter.sendMail(mailOptions , (err , info) => {
    if(!err) {
        res.json({status : 'ok' , data : info})
    } else {
        res.json({status:"error" , data : "Something went wrong"})
    }
})
})

app.listen(4000 , (err) => {
    if(!err) {
        console.log('App is listening....')
    }
})