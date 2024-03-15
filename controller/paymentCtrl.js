const Razorpay = require("razorpay");



const instance = new Razorpay({
 key_id: "pk_test_51OcLYFLipi5cnCBscdSKXFoBgpzQiwU9yGENm0RHUYT6bP4RkQnABuV2WYmqPI8C9HYoI3RZxqVUQkBR0thmgdfa00k3NSgrs9", 
 key_secret:"sk_test_51OcLYFLipi5cnCBswfjOgKljo97r2ADgpKda940Jz3kol6Di4v8OSCUpai8e6zrYsb9Iq1RgO46gxcvnbXsibOLi00whD9JKLs"
})



const checkout = async (req, res) => {
//   const {amount} = req.body
//   const option = {
//         amount: amount * 100,
//         currency: "ARS"
//     }
    
// const order = await instance.orders.create(option);
//     res.json({
//         success: true,
//         order
//     });
        res.send("WUU");
  };


const paymentVerification = async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId } = req.body;
        res.json({
            razorpayOrderId, razorpayPaymentId  
        });
    
    
  };



  module.exports = {
    checkout,
    paymentVerification,
  };
  