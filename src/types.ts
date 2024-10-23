import express from "express";
export type UserRequest = express.Request & {
  context?: any;
};

export const petTypes = [
  "dog",
  "cat",
  "lizard",
  "hamster",
  "bird",
  "fish",
  "rabbit",
  "other",
];
export const genders = ["male", "female", "unknown"];
