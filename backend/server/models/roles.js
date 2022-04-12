/**
 * Archivo de modelo "roles" para base de datos.
 * 
 * @author Juan-CamiloF
 */

const mongoose = require("mongoose");

const RolesSchema = new mongoose.Schema(
  {
    _id: String,
  },
  { versionKey: false }
);

const Roles = mongoose.model("role", RolesSchema);
module.exports.Roles = Roles;
