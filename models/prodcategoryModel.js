const mongoose = require("mongoose"); // Borrar si ya es necesario

// Declarar el esquema del modelo Mongo
var prodcategorySchema = new mongoose.Schema(
{
  title: {
    type: String,
    required: true,
    unique: true,
    index: true,
},
},
{
    timestamps: true,
}
);

//Export the model
module.exports = mongoose.model("PCategory", prodcategorySchema);