import express from "express";

const router = express.Router();

router.post('/foodData' , (req,res) => {
    try {
        res.send([global.food_data , global.food_category])
    } catch (error) {
        console.log(error.message);
        res.send("server error");
    }
})

export default router;