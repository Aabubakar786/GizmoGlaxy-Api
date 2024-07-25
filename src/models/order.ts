import mongoose, { Document, Schema } from 'mongoose';

interface IShippingInfo {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pinCode?: number;
}

interface IOrder extends Document {
  shippingInfo?: IShippingInfo;
  user?: String;
  subtotal?: number;
  tax?: number;
  shippingCharges?: number;
  discount?: number;
  total?: number;
  status?: 'Processing' | 'Shipping' | 'Delivered';
  orderItems?: {
    name: string;
    photo: string;
    price: number;
    quantity: number;
    productId: mongoose.Types.ObjectId;
  }[];
}

const shippingInfoSchema = new Schema<IShippingInfo>({
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  pinCode: {
    type: Number,
    required: true
  },
});

const orderSchema = new Schema<IOrder>({
  shippingInfo: {
    type: shippingInfoSchema,
    required: true
  },
  user: {
    type: String,
    ref: "User",
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    required: true
  },
  shippingCharges: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["Processing", "Shipping", "Delivered"],
    default: "Processing"
  },
  orderItems: [{
    name: {
      type: String,
      required: true
    },
    photo: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true
    }
  }]
}, {
  timestamps: true
});

export const Order = mongoose.model<IOrder>("Order", orderSchema);
