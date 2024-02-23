const express = require('express');
// const Mercado_Pago = require('mercadopago');



const Mercado_Pago = express.Router();


Mercado_Pago.post("/", async (req, res) => {
    try {
        
    } catch (error) {
      console.log(error.message)  
      res.status(500).json(error.message);
    }
})




module.exports = Mercado_Pago ;