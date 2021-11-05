const express = require('express')
const mongoose=require('mongoose')
const path = require('path')
const {port}=require('./config')
require('dotenv').config()
const app = express()

mongoose.connect(process.env.DATABASE,()=>{
    console.log("Connecting to Database")
})

app.use(express.json())
app.use(express.static(path.join(__dirname,'public')))
app.use(express.urlencoded({extended: true}))
app.set('view engine', 'ejs')

app.use(require('./routes/main'))



app.listen(port, () => {
    console.log(`start backend port:${port}`);
})