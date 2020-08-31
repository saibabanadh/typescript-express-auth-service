import mongoose from "mongoose";
import bcrypt from "bcrypt";
const saltRounds = 8;

export enum Gender{
  male = "male",
  female = "female",
  undisclosed = "undisclosed"
}

export interface IUser extends mongoose.Document{
  firstName: string;
  lastName: string;
  gender?: Gender;
  email: string;
  userName: string;
  password: string;
  lastLogin: Date;
  verifyPassword(pwd:string, pwdInDB:string): boolean;
}

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, enum: Object.values(Gender)},
  email: { type: String, unique: true, required: true },
  userName: { type: String, required: true },
  password: { type: String, required: true},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: null }
});

userSchema.pre('save', function<Iuser>(next:any) {
  const user = this;
  user.password = bcrypt.hashSync(user.password, saltRounds);
  next();
});

userSchema.methods.verifyPassword = (pwd:string, pwdInDB:string) => {
  const isMatched = bcrypt.compareSync(pwd, pwdInDB);
  return isMatched;
}

export default mongoose.model<IUser>("User", userSchema);
