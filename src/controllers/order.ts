import { Request, Response, NextFunction } from 'express';
import { TryCatch } from '../middlewares/error.js';
import { NewOrderRequestBody } from '../types/types.js';
import { Order } from '../models/order.js';

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

//   await reduceStock(orderItems);
 
  res.status(201).json({
    success: true,
    order
  });
});
