const express = require("express");
const Cube = require("../models/Cube");
const router = express.Router();

// GET cube state
router.get("/:id", async (req, res) => {
  try {
    let cube = await Cube.findOne({ cubeId: req.params.id });
    if (!cube) {
      cube = new Cube({ cubeId: req.params.id });
      await cube.save();
    }
    res.json(cube);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SAVE cube state
router.post("/:id/save", async (req, res) => {
  try {
    const { position, rotationSpeed } = req.body;
    let cube = await Cube.findOne({ cubeId: req.params.id });
    if (!cube) cube = new Cube({ cubeId: req.params.id });

    cube.position = position;
    cube.rotationSpeed = rotationSpeed;
    cube.lastSaved = new Date();
    cube.updatedAt = new Date();

    await cube.save();
    res.json({ success: true, cube });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// RESET cube state
router.post("/:id/reset", async (req, res) => {
  try {
    const cube = await Cube.findOneAndUpdate(
      { cubeId: req.params.id },
      { 
        position: { x: 0, y: 0, z: 0 },
        rotationSpeed: 0,
        lastSaved: new Date(),
        updatedAt: new Date()
      },
      { new: true, upsert: true }
    );
    res.json({ success: true, cube });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
