const express = require('express');
const app = express();
const dbConnect = require('./config/dbConnect');
const dotenv = require('dotenv').config();
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 5000;
const authRouter = require('./routes/authRoute');
const productRouter = require("./routes/productRoute");
const blogRouter = require("./routes/blogRoute");
const bodyParser = require("body-parser");
const categoryRouter = require("./routes/prodcategoryRoute");
const blogcategoryRouter = require("./routes/blogCatRoute");
const brandRouter = require("./routes/brandRoute");
const colorRouter = require("./routes/colorRoute");
const enqRouter = require("./routes/enqRoute");
const couponRouter = require("./routes/couponRoute");
const uploadRouter = require("./routes/uploadRoute");
const cors = require("cors");
const morgan = require("morgan");
// const Mercado_Pago = require('./routes/Mercado_pago');





// Conecta a la base de datos
dbConnect();

app.use(morgan("dev"));
// Rutas
app.get("/", (req, res) => {
  res.send("¡Hola, GIAMZON!");
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(cookieParser());

// Configuración de middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use("Mercado_Pago", Mercado_Pago);

// Rutas
app.use('/api/user', authRouter);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/category", categoryRouter);
app.use("/api/blogcategory", blogcategoryRouter);
app.use("/api/brand", brandRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/color", colorRouter);
app.use("/api/enquiry", enqRouter);
app.use("/api/upload", uploadRouter);



app.post("/send-email", async (req, res) => {
const emailData = {
    to: req.body.to,
    subject: req.body.subject,
    text: req.body.text,
    html: req.body.html,
  };

  try {
    await sendEmail(emailData);
    res.json({ success: true, message: "Correo electrónico enviado correctamente" });
  } catch (error) {
    console.error("Error al enviar correo electrónico:", error);
    res.status(500).json({ success: false, message: "Error al enviar correo electrónico" });
  }
});


//Middlewares 
app.use(notFound);
app.use(errorHandler);



// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor atento en PORT ${PORT}`);
});
