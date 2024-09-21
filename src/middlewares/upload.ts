import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import dotenv from "dotenv";
import express from "express";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async () => {
    return {
      folder: "pets",
      format: "webp",
    };
  },
});

export function destroy(url: string) {
  cloudinary.uploader.destroy(url, (error, result) => {
    if (result.result != "ok") {
      console.log("error deleting image:", result);
    } else if (result.result == "ok") {
      console.log(url, " deleted");
    }
    return;
  });
}

export default multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 },
});
