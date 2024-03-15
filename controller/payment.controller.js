const { MercadoPagoConfig,Payment, Preference } = require('mercadopago');
const Order = require("../models/orderModel");

//arreglo temporal para almacenar pedidos
let pendingOrders = [];


const createOrder = async (req, res) => {

   try{ 
    const data = req.body;
    const {nroOrden} = req.query;

    console.log(nroOrden);

    const client = new 
    MercadoPagoConfig({ accessToken: "TEST-2653742309143553-022519-2a65162f2c6e812047a243d2f463236c-1698409543", 
    options: { timeout: 5000 } });
    
    const preference = new Preference(client);
    
     const items = data.map((item,index)=> ({
             id: index,
             title: item.title,
             quantity: item.quantity,
             unit_price: item.price
      }))

    const result = await preference.create({body: {
     items:items,
     
    "shipments":{
        "cost": 1000,
        "mode": "not_specified",
     },
        back_urls: {
            success: "http://localhost:3000/",
            failure: "http://localhost:3000/"
        },
        metadata:{"NumOrd":nroOrden},
        notification_url: "https://89ad-38-25-15-10.ngrok-free.app/api/payment/webhook",

            }
        })

        //console.log(result);

        res.json(result);
        //res.send('create order');
   } catch (error) {
    console.error('Error en createOrder:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
}
};



const receiveWebhook = async (req, res) => {
    
     console.log(req.query);
     const {query} = req;
     const oc = query.id;
     const id = query['data.id'];


     if (req.query.type == "payment") {
        try {
            const response = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${'TEST-3390995395073329-031501-35cb2dea16aef42185dd799ad4d4fe49-1729319354'}`
                }
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            console.log("nro" + data.metadata.num_ord);
            const numoc = data.metadata.num_ord;
            
            const oc =  await Order.findOne({OrderId : numoc});

            if(oc){
                oc.orderStatus= 'Procesado'

                await oc.save()
                
                console.log('Documento actualizado correctamente', oc);
            }else{
                console.log('No se encontro el dato')
            }



   
        } catch (error) {
            console.error('Error:', error);
        }
    }
    
    

    //  if(req.query.type == "payment"){
    //     await fetch(`https://api.mercadopago.com/v1/payments/${id}`,{
    //     method: 'GET',
    //     headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${'TEST-2653742309143553-022519-2a65162f2c6e812047a243d2f463236c-1698409543'}`
    //     }
    //     }).then(response => {
    //         if(!response.ok){
    //             throw new Error ('Network response was not ok');
    //         }

    //         return response.json();
    //     })
    //     .then(data=> {
    //         console.log("nro" + data.metadata.num_ord);
    //         const numoc = data.metadata.num_ord 
           
    //         const orden = Orden.aggregate([
    //             {
    //                 $match: {
    //                     'paymentInfo.razorpayOrderId': razorpayOrderId
    //                 }
    //             }
    //         ]);
          
    //     })
        

    //  }

     res.send("webhook");

}

const OrdenTemporal = async(req,res) => {

     res.json(pendingOrders);

}

const deleteOrd =  async(req,res) => {
    console.log("borrando bd");
    pendingOrders = [];
    res.send('Datos de Orden temporal borrados');


}


module.exports = { createOrder, receiveWebhook, OrdenTemporal, deleteOrd };
