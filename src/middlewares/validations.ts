import { body } from "express-validator";
import { makeStringValidator } from "../helpers/make_validators.js";
import { genders, petTypes } from "../types.js";

const usernameValid = makeStringValidator("username", {
  min: 3,
  max: 20,
});

const passwordValid = makeStringValidator("password", {
  min: 5,
  max: 40,
});

//for posts (mainly)
const nameValid = makeStringValidator("name", {
  min: 3,
  max: 30,
});
const descriptionValid = makeStringValidator("description", {
  min: 3,
  max: 5000,
});
const imageValid = makeStringValidator("image", {
  min: 3,
  max: 1200,
});
const genderValid = makeStringValidator("gender")
  .isIn(genders)
  .withMessage(
    (e) => e + " is not a valid gender, use male, female or unknown"
  );

const petTypeValid = makeStringValidator("petType")
  .isIn(petTypes)
  .withMessage((e) => e + " is not a valid pet type");

const birthValid = body("birthDate")
  .custom((value) => {
    const date = new Date(value);
    if (isNaN(date.getFullYear())) {
      return false;
    } else {
      return true;
    }
  })
  .withMessage("birth date is invalid");
//middleware arrays for controllers
export const userValidation = [usernameValid, passwordValid];

export const postValidation = [
  nameValid,
  descriptionValid,
  imageValid,
  genderValid,
  petTypeValid,
  birthValid,
];
