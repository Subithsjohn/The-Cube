const mongoose = require("mongoose");

const cubeSchema = new mongoose.Schema({
  cubeId: { type: String, default: "cube_1" },
  position: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    z: { type: Number, default: 0 }
  },
  rotationSpeed: { type: Number, default: 0 },
  lastSaved: { type: Date },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Cube", cubeSchema);
