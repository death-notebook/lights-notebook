const express = require("express");
const router = express.Router();
const { People, User } = require("../models");

// Get a single person by ID
router.get("/:id", async (req, res, next) => {
  try {
    if (!req.user) res.sendStatus(401);
    else {
      const people = await People.findByPk(req.params.id, {
        include: [{
          model: User
        }]
      });
      if (people.userId !== req.user.id && req.user.role !== 'admin') res.sendStatus(401);
      else next(people);   //where is the response?
    }
  } catch (error) {
    next(error);
  }
  
});

// GET /People -- get all People
router.get("/", async (req, res, next) => {
  try {
    if (!req.user) res.sendStatus(401);
    else {
      const people = await People.findAll(req.user.role === 'admin' ? {} : { where: { userId: req.user.id } });
      next(people);
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    if (!req.user) res.sendStatus(401);
    else {
      const foundPerson = await People.findByPk(req.params.id);
      if (foundPerson.userId !== req.user.id && req.user.role !== 'admin') res.sendStatus(401);
      else {        //users should able to delete their own entry
        await People.destroy({
          where: {
            id: req.params.id,
          },
        });

        const updatedPeople = await People.findAll();
        next(updatedPeople);
      }
    }
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    if (!req.user) res.sendStatus(401);
    else {
      ({ name, image, cause, time, verifier, history } = req.body);
      const newPeople = await People.create({ name, image, cause, time, verifier, history, userId: req.user.id });
      next(newPeople);
    }
  } catch (error) {
    next(error);
  }
});


router.put("/:id", async (req, res, next) => {
  try {
    if (!req.user) res.sendStatus(401);
    else {
      const foundPerson = await People.findByPk(req.params.id);
      if (foundPerson.userId !== req.user.id && req.user.role !== 'admin') res.sendStatus(401);
      else {   //users should be able to edit their own entry
        await People.update(req.body, {   //vurnerable for injection / need destructing 
          where: {
            id: req.params.id,
          }
        });
        const result = await People.findByPk(req.params.id);
        next(result);
      }
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;