const { Router } = require("express");
const { createOrder, receiveWebhook,OrdenTemporal,deleteOrd } = require("../controller/payment.controller.js");

const router = Router();

router.post('/create-order', createOrder);

router.get('/success', (req, res) => {
    res.send('success');
});

router.post('/webhook', receiveWebhook);

router.get('/ordtemp', OrdenTemporal );
router.delete('/orddel', deleteOrd );

module.exports = router;