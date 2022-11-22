import { Datatypes } from "squelize";
import db from "../config/db.js";

const Usuario = db.define('usuarios', {
    nombre: {
        type: Datatypes.STRING,
        allowNull: false
    },
    email: {
        type: Datatypes.STRING,
        allowNull: false
    },
    password: {
        type: Datatypes.STRING,
        allowNull: false
    }
})