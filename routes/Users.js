const express = require('express')
const router = express.Router()
const { Users } = require('../models')
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const { validateToken } = require('../middlewares/Authmiddleware')


router.post("/", async (req,res) => {
    const { username, password } = req.body;
    bcrypt.hash(password, saltRounds).then((hash) =>{
        Users.create({
            username: username,
            password: hash,
        })
        res.json("success")
    })
})

router.post('/login', async (req, res) => {
const { username, password } = req.body;

const user = await Users.findOne({ where: {username: username}})

if (user){
bcrypt.compare(password, user.password).then((match)=>{
if (!match){ 
    return res.json({error: "wrong username or password."});
}
const accessToken = jwt.sign({username: user.username , id: user.id}, "importantsecret");
return res.json({token: accessToken, username: username, id: user.id})
});
}else {
    return res.json({error: "user does not exist"})
}
})

router.get('/auth', validateToken, (req,res) => {
res.json(req.user);
})

router.get("/basicinfo/:id", async (req,res) =>{
    const id = req.params.id;
 const basicInfo = await Users.findByPk(id, {attributes: {exclude: ['password']},
});
res.json(basicInfo);
})

router.put('/changepassword', validateToken, async (req, res) =>{
    const {oldPassword, newPassword} = req.body
    const user = await Users.findOne({ where: {username: req.user.username}})

 bcrypt.compare(oldPassword, user.password).then( async (match)=>{
        if (!match) res.json({error: "wrong password."});
        
        bcrypt.hash(newPassword, saltRounds).then((hash) =>{
          Users.update({password: hash}, {where: {username: req.user.username}})
            res.json("success")
        })
});
})



module.exports = router;