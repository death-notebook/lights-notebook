const express = require("express");
const router = express.Router();
const { People } = require("../models");

// Get a single person by ID
router.get("/:id", async (req, res, next) => {
  const people = await People.findByPk(req.params.id);
  res.send(people);
});

// GET /People -- get all People
router.get("/", async (req, res, next) => {
  try {
    const people = await People.findAll();
    res.json(people);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const people = await People.destroy({
      where: {
        id: req.params.id,
      },
    });

    const updatedPeople = await People.findAll();
    res.json(updatedPeople);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const newPeople = await People.create(req.body);
    res.json(newPeople);
  } catch (error) {
    next(error);
  }
});


router.put("/:id", async (req, res, next) => {
  try {
    const newPeople = await People.update(req.body, {
      where: {
        id: req.params.id,
      },
      returning: true,
    });
    const updatedPerson = await People.findByPk(req.params.id);
    res.json(updatedPerson);
  } catch (error) {
    next(error);
  }
});

module.exports = router;