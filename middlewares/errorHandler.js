//No Encontrado
/*
const notFound = (req, res, next) => {
    const error = new Error(`No Encontrado : ${req.originalUrl}`);
    res.status(404).json({ message: "Página no encontrada" }); // Envía una respuesta JSON con el mensaje de error
    next(error);
};


// Error Handler

const errorHandler = (err, req, res, next) => {
const statuscode = res.statusCode == 200 ? 500 : res.statusCode;
    res.status(statuscode);
    res.json({
        message: err?.message,
        stack: err?.stack,
    });
};

module.exports={ errorHandler,notFound }*/