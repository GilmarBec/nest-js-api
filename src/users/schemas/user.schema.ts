import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  email: String,
  firstName: String,
  lastName: String,
  password: String,
  username: String,
  role: String,
});
