const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema(
{
user: {
  type:mongoose.Schema.Types.ObjectId,
  ref:"User",
  required: true,
},

shippingInfo: {
  firstName: {
  type:String,
  required: true,
},

lastName: {
  type:String,
  required: true,
},

address: {
  type:String,
  required: true,
},

city: {
  type:String,
  required: true,
},
state: {
  type:String,
  required: true,
},

other: {
  type:String,
  required: true,
  },

pincode: {
  type:Number,
  required: true,
},
country: {
  type:String,
  required:true,
},
costoenv:{
  type:Number,
  required: true, 
},
}, 
OrderId: {
    type:String,
    required: true,
},
PaymentId: {
    type: String,
    required: false,
},


orderItems : [
  {
product: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Product",
  required: true,
},

color: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Color",
  required: true,
},

quantity: {
  type: Number,
  required: true,
},

price: {
  type: Number,
  required: true,
}
}
],

paidAt: {
  type: Date,
  default: Date.now(),
  required: true,
},
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Month
createdAt: {
  type: Date,
  default: Date.now
},

month: {
  type: String,
  required: true,
  default: () => {
    return new Date().toLocaleString('en-US', { month: 'long' });
  }
  },

totalPrice : {
  type: Number,
  required: true,

},
totalPriceAfterDiscount: {
  type: Number,
  required: true,

},
orderStatus: {
  type: String,
    default: "Ordered",
},
},
{
  timestamps: true,
}
);
///////////////////////////////////////////////////////////////////////////////////////////////////////////  Month
// Método para establecer el campo "month" basado en la fecha de creación
orderSchema.pre('save', function(next) {
  const order = this;
  order.month = order.createdAt.getMonth(); 
  next();
});



//Export the model
module.exports = mongoose.model("Order", orderSchema);




