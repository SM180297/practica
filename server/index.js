const mongoose = require("mongoose");
const app = require("./app");
const port = process.env.PORT || 3977;

const { API_VERSION, IP_SERVER, PORT_DB } = require("./config");


mongoose.connect(`mongodb://${IP_SERVER}:${PORT_DB}/pruebas`
    , { useNewUrlParser: true, useUnifiedTopology: true },
    (err, res) => {
        if (err) {
            throw err;
        }
        else {
            console.log("la conexion a la base fue correcta");
            app.listen(port, () => {
                console.log("################ API  ################");
                console.log(`http://${IP_SERVER}:${port}/api/${API_VERSION}/`)

            })
        }
    });
