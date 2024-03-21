import { Schema, model, Document } from 'mongoose';

import bcrypt from 'bcryptjs';
import { IWorkout } from './workout';

export interface IUser extends Document {
    fullName: string;
    email: string;
    isAdmin: boolean;
    DOB: Date;
    username: string;
    password: string;
}

const UserSchema = new Schema<IUser>({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    DOB: { type: Date, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }
});

UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const User = model<IUser>('User', UserSchema);

export default User;