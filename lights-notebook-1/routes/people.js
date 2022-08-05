const express = require("express");
const router = express.Router();
const { Person } = require("../models");

// Get a single person by ID
router.get("/:id", async (req, res, next) => {
  const person = await Person.findByPk(req.params.id);
  res.json(person);
});

// GET /Person -- get all Persons
router.get("/", async (req, res, next) => {
  try {
    const persons = await Person.findAll();
    res.json(persons);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const persons = await Person.destroy({
      where: {
        id: req.params.id,
      },
    });

    const updatedPerson = await Person.findAll();
    res.json(updatedPerson);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const newPerson = await Person.create(req.body);
    res.json(newPerson);
  } catch (error) {
    next(error);
  }
});


router.put("/:id", async (req, res, next) => {
  try {
    const newPerson = await Person.update(req.body, {
      where: {
        id: req.params.id,
      },
      returning: true,
    });
    res.json(newPerson);
  } catch (error) {
    next(error);
  }
});

module.exports = router;