import { Request, Response, NextFunction } from 'express';
import { TryCatch } from '../middlewares/error.js';
import { NewOrderRequestBody } from '../types/types.js';
import { Order } from '../models/order.js';
import ErrorHandler from '../utils/utility-class.js';
import { invalidateCache } from '../utils/features.js';

// Create a new order
export const createOrder = TryCatch(async (req: Request<{}, {}, NewOrderRequestBody>, res: Response, next: NextFunction) => {
  const {
    shippingInfo,
    user,
    subtotal,
    tax,
    shippingCharges,
    discount,
    total,
    orderItems
  } = req.body;

  // Validate request body
  if (!shippingInfo || !orderItems || !user || !subtotal || !tax || !shippingCharges || !discount || !total) {
    return next(new ErrorHandler("Please enter all fields", 400));
  }

  // Create the order
  const order = await Order.create({
    shippingInfo,
    user,
    subtotal,
    tax,
    shippingCharges,
    discount,
    total,
    orderItems
  });

  // Optionally reduce stock here
  // await reduceStock(orderItems);

  res.status(201).json({
    success: true,
    order
  });
});

// Get all orders
export const getAllOrders = TryCatch(async (req: Request, res: Response, next: NextFunction) => {
  // const orders = await Order.find();
  const orders = await Order.find().populate({
    path: 'user',
    select: 'name email gender' 
  });
  // Check if orders exist
  if (!orders || orders.length === 0) {
    return next(new ErrorHandler("No orders found", 404));
  }

  res.status(200).json({
    success: true,
    orders
  });
});

// Update order status based on processing
export const processOrder = TryCatch(async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  const { id } = req.params;

  // Find the order by ID
  const order = await Order.findById(id);

  // Check if the order exists
  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  // Update order status
  switch (order.status) {
    case "Processing":
      order.status = "Shipping";
      break;
    case "Shipping":
      order.status = "Delivered";
      break;
    default:
      // If the order is already delivered or in an unexpected state, you can handle it accordingly
      return next(new ErrorHandler("Order status cannot be updated", 400));
  }

  // Save the updated order
  await order.save();

  // Invalidate cache
  await invalidateCache({ product: true, order: true, admin: true });

  res.status(200).json({
    success: true,
     message: "Order updated successfully",
    order
  });
});


export const deleteOrder = TryCatch(async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  const { id } = req.params;

  // Find the order by ID
  const order = await Order.findById(id);

  // Check if the order exists
  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  // Delete the order
  await order.deleteOne();

  // Invalidate cache
  await invalidateCache({ product: true, order: true, admin: true });

  res.status(200).json({
    success: true,
    message: "Order deleted successfully"
  });
});