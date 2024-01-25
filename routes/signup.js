const express = require('express');
const router = express.Router();
const bodyParser=require('body-parser');

router.post("/Signup",(req,res)=>{
    console.log(req.body);
    res.json(req.body);
})

module.exports= router;