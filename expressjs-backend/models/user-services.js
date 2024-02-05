import mongoose from "mongoose";
import userModel from "./user.js";
import bcrypt from "bcrypt";
import validator from 'validator';
import sanitize from 'mongo-sanitize';

// uncomment the following line to view mongoose debug messages
mongoose.set("debug", true);

mongoose
  .connect("mongodb://127.0.0.1:27017/users", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => console.log(error));

async function getUsers(name, job) {
  let result;
  if (name === undefined && job === undefined) {
    result = await userModel.find();
  } else if (name && !job) {
    result = await findUserByName(name);
  } else if (job && !name) {
    result = await findUserByJob(job);
  }
  return result;
}

async function findUserById(id) {
  try {
    return await userModel.findById(id);
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

async function addUser(user) {
  try {
    const userToAdd = new userModel(user);
    const savedUser = await userToAdd.save();
    return savedUser;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function isValidUsername(username) {
  // Allow only letters, numbers, and underscores
  const re = /^[a-zA-Z0-9_]+$/;
  return re.test(username);
}

async function findUserByName(username) {
  if (!isValidUsername(username)) {
    throw new Error('Invalid username');
  }

  let sanitizedUsername = sanitize(username);
  return await userModel.find({ username: sanitizedUsername });
}


async function findUserByJob(job) {
  return await userModel.find({ job: job });
}

async function getAllContacts() {
  try {
    return await userModel.find();
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

async function getAllUsers() {
  try {
    return await userModel.find({}, { password: 1 });
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

export default {
  addUser,
  getUsers,
  findUserById,
  findUserByName,
  findUserByJob,
  getAllContacts,
  getAllUsers,
};
