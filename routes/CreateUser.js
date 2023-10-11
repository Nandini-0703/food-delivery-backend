import express from "express";
import { User } from "../models/User.js";
import { body, validationResult } from 'express-validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
const jwtsecret = 'mynameisnandiniaggarwalwhatisyournametellittome'


const router = express.Router();

router.post('/',  [
   body('email', 'incorrect email').isEmail(),
    body('name', 'incorrect name').isLength({ min: 5 }),
    body('password', 'incorrect password').isLength({ min: 5 })] ,
    async (request, response) => {

       const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({ errors: errors.array() });
        } 
        const salt = await bcrypt.genSalt(10);
        const secpassword = await bcrypt.hash(request.body.password , salt)
        try {
            if (!request.body.name ||
                !request.body.location ||
                !request.body.email ||
                !request.body.password
            ) {
                return response.status(400).send({ message: "send all the required fields" })
            }

            const newuser = {
                name: request.body.name,
                location: request.body.location,
                email: request.body.email,
                password: secpassword,

            };

            const user = await User.create(newuser);

            return response.status(201).send(user);
        } catch (error) {
            console.log(error);
            return response.status(500).send({ message: error.message });
        }
    });

    router.post('/loginuser' ,
      [
        body('email', 'incorrect email').isEmail(),
        
         body('password', 'incorrect password').isLength({ min: 5 })] ,
         async (request, response) => {
     
            const errors = validationResult(request);
             if (!errors.isEmpty()) {
                 return response.status(400).json({ errors: errors.array() });
             } 
     
             try {
                 if (
                     !request.body.email ||
                     !request.body.password
                 ) {
                     return response.status(400).send({ message: "send all the required fields" })
                 }

               
     
                 const newuser = {
                   email: request.body.email,
                    };
     
                 const userdata = await User.findOne(newuser);
                 if(!userdata){
                    return response.status(400).send({ message : "try logging with correct credentials"})
                 }
                 const pwdcompare = await bcrypt.compare(request.body.password , userdata.password);
                 if(!pwdcompare){            
                   return response.status(404).json({ message : "try logging with correct credentials"})
                 }
                 const data = {
                    user:{
                        id:userdata.id
                    }
                 }

                 const authToken = jwt.sign(data , jwtsecret)
                 return response.status(201).send({userdata , authToken:authToken});
                 
             } catch (error) {
                 console.log(error);
                 return response.status(500).send({ message: error.message });
             }
         });
     

export default router; 