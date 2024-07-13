import { Schema, model, models, Document } from "mongoose";

export interface IUser extends Document {
  userId: string;
  password?: string;
  role: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    userId: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const User = models.User || model<IUser>("User", UserSchema);

export default User;
