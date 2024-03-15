const { generateToken } = require("../config/jwtToken");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshtoken");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("./emailCtrl");
const uniqid = require("uniqid");




const createUser = asyncHandler(async (req, res) => {

console.log(req.body);
//Crear Usuario
const email = req.body.email;
const findUser = await User.findOne({ email : email});
    if(!findUser) {
        const newUser = await User.create(req.body);
          res.json(newUser);
} else {
  throw new Error("Usuario ya existe");
}
});




//Login
const loginUserCtrl= asyncHandler(async (req, res) => {
  const {email, password} = req.body;
   
  //Chequeo de usuario existente
const findUser = await User.findOne({ email });
if(findUser && (await findUser.isPasswordMatched(password))) {
const refreshToken = await generateRefreshToken(findUser?._id);
const updateuser = await User.findByIdAndUpdate(
  findUser.id,
  {
    refreshToken: refreshToken,
  },
  { new: true }
);
res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  maxAge: 72 * 60 * 60 * 1000,
});

  res.json({
    _id: findUser?._id,
    firstname: findUser?.firstname,
    lastname: findUser?.lastname,
    email: findUser?.email,
    mobile: findUser?.mobile,
    token: generateToken(findUser?._id),
  });
}else {
  throw new Error("Credencial Invalida");
}

});




// admin login

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check if user exists or not
  const findAdmin = await User.findOne({ email });
  if (findAdmin.role !== "admin") throw new Error("Not Authorised");
  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findAdmin?._id);
    const updateuser = await User.findByIdAndUpdate(
      findAdmin.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findAdmin?._id,
      firstname: findAdmin?.firstname,
      lastname: findAdmin?.lastname,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      token: generateToken(findAdmin?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});




//Handle Refrescar token
const handleRefreshToken = asyncHandler(async (req, res) => {
const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No hay token de actualización en las cookies");
const refreshToken = cookie.refreshToken;
const user = await User.findOne({ refreshToken });
  if (!user) throw new Error(" No hay ningún token de actualización presente en la base de datos o no coincide");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("Hay algún problema con el token de actualización");
}
const accessToken = generateToken(user?._id);
    res.json({ accessToken });
});
});






// funcionalidad de cierre de sesión

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No hay token de actualización en las cookies");
const refreshToken = cookie.refreshToken;
const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
});
    return res.sendStatus(204); // prohibido
}
  await User.findOneAndUpdate(refreshToken, {
    refreshToken: "",
});
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
});
  res.sendStatus(204); // prohibido
});





////Actualizar Usuario
const updatedUser = asyncHandler(async (req, res) => {
const {_id} = req.user;
validateMongoDbId(_id)
  try {
const updatedUser = await User.findByIdAndUpdate(_id, {
    firstname: req?.body?.firstname,
    lastname: req?.body?.lastname,
    email: req?.body?.email,
    mobile: req?.body?.mobile,
}, 
{
  new: true,
});
    res.json(updatedUser);
} catch (error) {
   throw new Error(error); 
}
})



// save user Address

const saveAddress = asyncHandler(async (req, res, next) => {
const { _id } = req.user;
  validateMongoDbId(_id);

  try {
const updatedUser = await User.findByIdAndUpdate(
     _id,
{
    address: req?.body?.address,
},
{
   new: true,
}
);
    res.json(updatedUser);
} catch (error) {
    throw new Error(error);
}
});



///////Get all users
const getallUser = asyncHandler(async (req, res) => {
 try {
  const getUsers = await User.find();
  res.json(getUsers);
 } catch (error) {
  throw new Error(error);
 }
})




////Get a single
const getaUser = asyncHandler(async (req, res) => {
  const {id} = req.params;
  validateMongoDbId(id)
  try {
  const getaUser = await User.findById(id);
  res.json({
    getaUser,
  });
  } catch (error) {
    throw new Error(error);
  }
})




////Delete 
const deleteaUser = asyncHandler(async (req, res) => {
  const {id} = req.params;
  validateMongoDbId(id)
  try {
  const deleteaUser = await User.findByIdAndDelete(id);
  res.json({
    deleteaUser,
  });
  } catch (error) {
    throw new Error(error);
  }
})




///BlockUser
const blockUser = asyncHandler(async (req, res) => {
const {id} = req.params;
validateMongoDbId(id)
  try {
const block = await User.findByIdAndUpdate(id, {
    isBlocked:true,
}, 
{
  new:true,
}
);
res.json({
  message:("Usuario Bloqueado")
})
} catch (error) {
    throw new Error(error);
}
})




//Unblock
const unblockUser = asyncHandler(async (req, res) => {
  const {id} = req.params;
  validateMongoDbId(id);

    try {
  const unblock = await User.findByIdAndUpdate(id, {

      isBlocked:false,
  }, 
  {
    new:true,
  }
  );
  res.json({
    message:("Usuario Desbloqueado")
  })
  } catch (error) {
      throw new Error(error);
  }
  })


// Update Password

const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongoDbId(_id);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.json(updatedPassword);
  } else {
    res.json(user);
  }
});


const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error("Usuario no encontrado con este correo electrónico");
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `Hola, sigue este enlace para restablecer tu contraseña. Este enlace es válido hasta dentro de 10 minutos. <a href='http://localhost:3001/reset-password/${token}'>Click Here</>`;
    const data = {
      to: email,
      text: "Hola, Usuario",
      subject: "Olvidé el enlace de contraseña",
      htm: resetURL,
    };
    sendEmail(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
});


const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("El token ha caducado. Vuelve a intentarlo más tarde.");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
});


const getWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const findUser = await User.findById(_id).populate("wishlist");
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});


/////////////////////////////////////////////////////////////////// COMPARE
const getCompare = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    // Encontrar al usuario y obtener los productos que ha agregado para comparar
    const findUser = await User.findById(_id).populate("compare");

    // Obtener la lista de productos del usuario
    const products = findUser.compare;

    // Verificar si hay al menos dos productos para comparar
    if (products.length < 2) {
      return res.status(400).json({ message: "Se requieren al menos dos productos para comparar" });
    }

    // Comparar los precios de los productos
    const prices = products.map(product => product.price);
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);

    // Comparar las características de los productos
    const firstProductFeatures = products[0].features;
    const isSameFeatures = products.every(product => compareFeatures(firstProductFeatures, product.features));

    // Retornar la respuesta con los resultados de la comparación
    res.json({ maxPrice, minPrice, isSameFeatures });
  } catch (error) {
    res.status(500).json({ message: "Error al comparar productos", error: error.message });
  }
});

// Función para comparar las características de dos productos
function compareFeatures(features1, features2) {
  // Ejemplo de comparación: verificar si todas las claves y valores son iguales
  const keys1 = Object.keys(features1);
  const keys2 = Object.keys(features2);

  // Verificar si los productos tienen las mismas características
  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (features1[key] !== features2[key]) {
      return false;
    }
  }

  return true;
}


 





const userCart = asyncHandler(async (req, res) => {
  console.log("goo")
  const { productId, color, quantity, price } = req.body;
  const id = req.params.id;
  //console.log(req.user);
  console.log(productId);
  console.log(color);
  console.log(quantity);
  console.log(price);
  console.log(req.body);
  //validateMongoDbId(_id); 
  console.log(id);
  console.log("llego");
  try {
    let newCart = await new Cart({
      userId: id,
      productId,
      color,
      price,
      quantity
        }).save();
    console.log(newCart)
    res.json({newCart});
  } catch (error) {
    //throw new Error(error);
    console.log(error)
  }
});




const removeProductFromCart = asyncHandler(async (req, res) => {
  //const { _id } = req.user;
  const id = req.params.id;
  const userId = req.params.userId;
  console.log("ay id :" + id);
  console.log("tupi");
  //validateMongoDbId(_id);
  try {
    const deleteProductFromCart = await Cart.deleteOne({ productId:id,userId: userId});
    console.log(deleteProductFromCart);
    res.json(deleteProductFromCart);
  } catch (error) {
    throw new Error(error);
  }
});




const emptyCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const deleteCart = await Cart.deleteMany({ userId:_id });
    res.json(deleteCart);
  } catch (error) {
    throw new Error(error);
  }
});




const updateProductQuantityFromCart = asyncHandler(async (req, res) => {
  //const { _id } = req.user;
  const { id,userId } = req.params;
  const {quantity} = req.query
  console.log(req.query)
  console.log(quantity);
  console.log(id);
  console.log(userId);
  //validateMongoDbId(_id);
  try {
    const cartItem = await Cart.findOne({ productId:id,userId: userId });
    if(!cartItem){
      return res.status(404).json({message: 'Producto no encontrado en el carrito del usuario' });
    }
    cartItem.quantity = quantity;
    await cartItem.save()
    res.json(cartItem);
  } catch (error) {
    throw new Error(error);
  }
});




const getUserCart = asyncHandler(async (req, res) => {
  
  const userId = req.params.userId;
  console.log(userId);
  
try {
  // Busca documentos de la colección de carritos que corresponden al usuario específico.
  if(userId){
  const cart = await Cart.find({userId: userId}).populate("productId").populate("color");
  const products = cart.map(item => item.productId);
  console.log(cart);
  console.log(products);
  res.json({
    cart
  });
}
} catch (error) {
  throw new Error(error);
}
});


const createOrder = asyncHandler(async (req, res) => {
 
  console.log("llego aqui")
  const { shippingInfo, orderItems, totalPrice, totalPriceAfterDiscount, OrderId } = req.body;
  const  _id  = "65d9315d3c44da50e2558595";
  // validateMongoDbId(_id);
  try {
    const order = await Order.create({ 
      shippingInfo, orderItems, totalPrice, totalPriceAfterDiscount, OrderId , user:_id
     });
    res.json({
      order, 
      success: true
    });
  } catch (error) {
    throw new Error(error);
  }
});



                 ///////////////                          /////////////////////////////
                                                         //CONTROL de Ordenes Car//
const getMyOrders = asyncHandler(async (req, res) => {
//const { _id } = req.user;
  try {
const orders = await Order.find({ user: _id })
       .populate("user")
       .populate("orderItems.product")
       .populate("orderItems.color")
       .exec();
    res.json({orders});
} catch (error) {
    throw new Error(error);
}
});



const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find().populate('user');
      
    res.json(orders);
  } catch (error) {
    throw new Error(error);
  }
});


const getSingleOrders = asyncHandler(async (req, res) => {
  const { id } = req.params; 
  console.log(id);

  try {
    const orders = await Order.findOne({_id:id}).populate("orderItems.product").populate('orderItems.color');
      
    res.json({orders});
  } catch (error) {
    throw new Error(error);
  }
});


const updateOrder = asyncHandler(async (req, res) => {
  const { id } = req.params; 
  console.log(id);

try {
    const orders = await Order.findById(id);
     orders.orderStatus = req.body.status;
     await orders.save() 
    res.json({orders});
} catch (error) {
    throw new Error(error);
}
});





const getMonthWiseOrderIncome = asyncHandler(async (req, res) => {

let monthNames = ["January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"];

let d = new Date();
let endDate= "";
d.setDate(1)
for (let index = 0; index < 11; index++) {
  d.setMonth(d.getMonth() -1)
  endDate = monthNames[d.getMonth()] + " " +  d.getFullYear()
  
}


const data = await Order.aggregate([
{
  $match: {
    createdAt: {
    $lte: new Date(),
    $gte: new Date(endDate)
  }
  }
}, {
  $group: {
    _id: {
      month: "$month"
}, amount:{ $sum: "$totalPriceAfterDiscount"}, count: {$sum: 1}

}
}
])
res.json(data)
});



const getYearlyOrders = asyncHandler(async (req, res) => {
let monthNames = ["January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"];

let d = new Date();
let endDate= "";
d.setDate(1)
for (let index = 0; index < 11; index++) {
  d.setMonth(d.getMonth() -1)
  endDate = monthNames[d.getMonth()] + " " +  d.getFullYear()
  
}



const data = await Order.aggregate([
  {
    $match: {
      createdAt: {
        $lte: new Date(),
        $gte: new Date(endDate)
      }
    }
  }, {
    $group: {
      _id: null,  
   count:{ $sum: 1 },
   amount:{ $sum: "$totalPriceAfterDiscount"}
  }
  }
])
res.json(data)
});












// const applyCoupon = asyncHandler(async (req, res) => {
//   const { coupon } = req.body;
//   const { _id } = req.user;
//   validateMongoDbId(_id);
//   const validCoupon = await Coupon.findOne({ name: coupon });
//   if (validCoupon === null) {
//     throw new Error("Invalid Coupon");
//   }
//   const user = await User.findOne({ _id });
//   let { cartTotal } = await Cart.findOne({
//     orderby: user._id,
//   }).populate("products.product");
//   let totalAfterDiscount = (
//     cartTotal -
//     (cartTotal * validCoupon.discount) / 100
//   ).toFixed(2);
//   await Cart.findOneAndUpdate(
//     { orderby: user._id },
//     { totalAfterDiscount },
//     { new: true }
//   );
//   res.json(totalAfterDiscount);
// });



// const createOrder = asyncHandler(async (req, res) => {
// const { COD, couponApplied } = req.body;
// const { _id } = req.user;
//   validateMongoDbId(_id);
//   try {
//     if (!COD) throw new Error("Create cash order failed");
// const user = await User.findById(_id);
//     let userCart = await Cart.findOne({ orderby: user._id });
//     let finalAmout = 0;
//     if (couponApplied && userCart.totalAfterDiscount) {
//       finalAmout = userCart.totalAfterDiscount;
// } else {
//       finalAmout = userCart.cartTotal;
// }

// let newOrder = await new Order({
//   products: userCart.products,
//   paymentIntent: {
// id: uniqid(),
//     method: "COD",
//     amount: finalAmout,
//     status: "Cash on Delivery",
//     created: Date.now(),
//     currency: "usd",
// },
//     orderby: user._id,
//     orderStatus: "Cash on Delivery",
// }).save();
// let update = userCart.products.map((item) => {
// return {
//     updateOne: {
//     filter: { _id: item.product._id },
//     update: { $inc: { quantity: -item.count, sold: +item.count } },
// },
// };
// });
//   const updated = await Product.bulkWrite(update, {});
//     res.json({ message: "success" });
// } catch (error) {
//     throw new Error(error);
// }
// });









module.exports ={createUser, 
  loginUserCtrl, 
  getallUser, 
  getaUser, 
  deleteaUser, 
  updatedUser, 
  blockUser, 
  unblockUser, 
  handleRefreshToken, 
  logout,
  updatePassword, 
  forgotPasswordToken, 
  resetPassword,
  getWishlist, 
  loginAdmin, saveAddress, 
  createOrder,
  getMyOrders,
  getMonthWiseOrderIncome,
  getYearlyOrders,
  getSingleOrders,
  updateOrder,
  emptyCart, 
  getCompare,
  // applyCoupon, createOrder, 
  getAllOrders, 
  // getOrderByUserId,  
  userCart, getUserCart,
  removeProductFromCart, updateProductQuantityFromCart

};