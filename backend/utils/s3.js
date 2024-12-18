const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

const uploadProfileImage = async (fileBuffer, fileName, userId) => {
  const fileExtension = fileName.split('.').pop();
  const uniqueFileName = `${userId}_${Date.now()}.${fileExtension}`;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `profiles/${uniqueFileName}`,
    Body: fileBuffer,
    ContentType: `image/${fileExtension}`,
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  
  return {
    Location: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/profiles/${uniqueFileName}`
  };
};

const updateProfileImage = async (userId, oldImageKey, fileBuffer, fileName) => {
  if (oldImageKey) {
    await deleteFile(oldImageKey);
  }
  
  return await uploadProfileImage(fileBuffer, fileName, userId);
};

const uploadPostImage = async (fileBuffer, fileName, userId) => {
  const fileExtension = fileName.split('.').pop();
  const uniqueFileName = `${userId}_${Date.now()}.${fileExtension}`;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `posts/${uniqueFileName}`,
    Body: fileBuffer,
    ContentType: `image/${fileExtension}`,
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  
  return {
    Location: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/posts/${uniqueFileName}`
  };
};

module.exports = {
  uploadProfileImage,
  updateProfileImage,
  uploadPostImage,
};
