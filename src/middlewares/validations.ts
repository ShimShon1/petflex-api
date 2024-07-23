import { body } from "express-validator";
import { makeStringValidator } from "../helpers/make_validators.js";

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
const genderValid = makeStringValidator("gender");
const petTypeValid = makeStringValidator("petType");

export const userValidation = [usernameValid, passwordValid];

export const postValidation = [
  nameValid,
  descriptionValid,
  imageValid,
  genderValid,
  petTypeValid,
];
