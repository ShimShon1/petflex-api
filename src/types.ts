import express from "express";
export type UserRequest = express.Request & {
  context?: any;
};

export const petTypes = ["dog", "cat", "lizard", "hamster", "rabbit"];
export const genders = ["male", "female", "unknown"];
