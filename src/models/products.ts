import mongoose, { Document, Schema } from 'mongoose';
import validator from 'validator';

interface IProduct extends Document {
    name: string;
    photo: string;
    price: Number;
    stock: Number;
    category: String
}

const productSchema = new Schema<IProduct>({

    name: {
        type: String,
        required: [true, "Please enter name"],
    },
    photo: {
        type: String,
        required: [true, "Please enter photo"],
    },
    price: {
        type: Number,
        required: [true, "Please enter price"],
    },
    stock: {
        type: Number,
        required: [true, "Please enter stock"],
    },
    category: {
        type: String,
        required: [true, "Please enter product category"],
        trim: true
    },
}, {
    timestamps: true,
});



export const Product = mongoose.model<IProduct>("Product", productSchema);
