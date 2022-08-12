const { persons } = require("./seedData.js");

const { sequelize } = require("./db");
const { person } = require("./models");

const seed = async () => {
  try {
    // drop and recreate tables per model definitions
    await sequelize.sync({ force: true });

    // insert data
    await Promise.all(persons.map((person) => person.create(person)));

    console.log("db populated!");
  } catch (error) {
    console.error(error);
  }
};

seed();