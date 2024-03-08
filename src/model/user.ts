import { Schema, model, Document } from 'mongoose';

import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    fullName: string;
    email: string;
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
});

UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const User = model<IUser>('Workout', UserSchema);

export default User;