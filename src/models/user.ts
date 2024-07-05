import mongoose, { Document, Schema } from 'mongoose';
import validator from 'validator';

interface IUser extends Document {
    _id: string;
    name: string;
    photo: string;
    email: string;
    role: 'admin' | 'user';
    gender: 'Male' | 'Female';
    dob: Date;
    createdAt: Date;
    updatedAt: Date;
    age: number; // virtual attribute
}

const userSchema = new Schema<IUser>({
    _id: {
        type: String,
        required: [true, "Please enter ID"],
    },
    name: {
        type: String,
        required: [true, "Please enter name"],
    },
    email: {
        type: String,
        unique: true,
        required: [true,"Please enter email"],
        validate: validator.default.isEmail
    },
    photo: {
        type: String,
        required: [true, "Please enter photo"],
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
    gender: {
        type: String,
        enum: ["Male", "Female"],
        required: [true, "Please select gender"],
    },
    dob: {
        type: Date,
        required: [true, "Please select date of birth"],
    },
}, {
    timestamps: true,
});

userSchema.virtual("age").get(function (this: IUser) {
    const today = new Date();
    const birthDate = new Date(this.dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
});

export const User = mongoose.model<IUser>("User", userSchema);
