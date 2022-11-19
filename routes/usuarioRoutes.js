import express from "express";

const router = express.Router();

//Routing
router.get('/', (req, res) => {
    res.json({msg:'Hola Mundo en express'})    
});


export default router