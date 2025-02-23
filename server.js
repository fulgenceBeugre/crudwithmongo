const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
port = 3000;
dotenv.config();

// connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((error) => console.log("Connexion à MongoDB échouée !", error));

// Create a person schema
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: Number,
  favoriteFoods: [String],
});

//Create a person model
const Person = mongoose.model("Person", personSchema);

//Creating and saving a single person
const createAndSavePerson = (show) => {
  const person = new Person({
    name: "MelDev",
    age: 40,
    favoriteFoods: ["Attieket", "Poisson"],
  });

  //Save person
  person.save((err, data) => {
    if (err) return show(err);
    show(null, data);
  });
};

//Creating multiple persons with Model.create()
const arrayOfPeople = [
  {
    name: "Melbourn",
    age: 40,
    favoriteFoods: ["Riz", "Poulet"],
  },
  {
    name: "Mary",
    age: 30,
    favoriteFoods: ["Placali", "Burritos"],
  },
  {
    name: "MelDev",
    age: 30,
    favoriteFoods: ["Attieket", "Kplo"],
  },
];

//Create many people
const createManyPeople = (arrayOfPeople, show) => {
  Person.create(arrayOfPeople, (err, data) => {
    if (err) return show(err);
    show(null, data);
  });
};

//Find all people with a given name
const findPeopleByName = async (personName) => {
  try {
    const people = await Person.find({ name: personName });
    console.log(people);
    return people;
  } catch (err) {
    console.error(err);
  }
};

//Find a person with a favorite food
const findOneByFood = (food, show) => {
  Person.findOne({ favoriteFoods: food }, (err, data) => {
    if (err) return show(err);
    show(null, data);
  });
};

//Find one person by id

const findPersonById = async (personId) => {
  try {
    const person = await Person.findById(personId);
    console.log(person);
    return person;
  } catch (err) {
    console.error(err);
  }
};

//Update a person (add a favorite food)
const findEditThenSave = async (personId) => {
  try {
    const person = await Person.findById(personId);
    if (!person) return console.log("Person not found");

    person.favoriteFoods.push("Hamburger");
    await person.save();
    console.log(person);
    return person;
  } catch (err) {
    console.error(err);
  }
};

//Find a person by name and change their age.
const findAndUpdate = async (personName) => {
  try {
    const updatedPerson = await Person.findOneAndUpdate(
      { name: personName },
      { age: 50 },
      { new: true }
    );
    console.log(updatedPerson);
    return updatedPerson;
  } catch (err) {
    console.error(err);
  }
};

//Delete a person by their ID
const removeById = async (personId) => {
  try {
    const removedPerson = await Person.findByIdAndRemove(personId);
    console.log(removedPerson);
    return removedPerson;
  } catch (err) {
    console.error(err);
  }
};

//Delete all people named "Mary"
const removeManyPeople = async () => {
  try {
    const result = await Person.deleteMany({ name: "Mary" });
    console.log(result);
    return result;
  } catch (err) {
    console.error(err);
  }
};

//Requête avancée avec filtrage, tri et limitation
const queryChain = async () => {
  try {
    const data = await Person.find({ favoriteFoods: "Burritos" })
      .sort({ name: 1 })
      .limit(2)
      .select("-age");
    console.log(data);
    return data;
  } catch (err) {
    console.error(err);
  }
};

app.listen(port, () => {
  console.log(`Server is running on localhost:${port}`);
});

async () => {
  await createAndSavePerson();
  await createManyPeople(arrayOfPeople);
  await findPeopleByName("MelDev");
  await findOneByFood("Burritos");
  await findPersonById("ID_D_UNE_PERSONNE");
  await findEditThenSave("ID_D_UNE_PERSONNE");
  await findAndUpdate("MelDev");
  await removeById("ID_D_UNE_PERSONNE");
  await removeManyPeople();
  await queryChain();
};
