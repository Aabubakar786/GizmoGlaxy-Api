import { NextFunction, Request, Response } from "express";
import { NewProductBody } from "../types/types.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "../middlewares/error.js";
import { Product } from "../models/products.js";
import { rm } from "fs";
import { nodeCache } from "../app.js";
import { invalidateCache } from "../utils/features.js";

export const createProducts = TryCatch(
  async (
    req: Request<{}, {}, NewProductBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, price, stock, category } = req.body;
    const photo = req.file;

    if (!photo) return next(new ErrorHandler("Please add photo", 400));
    if (!name || !price || !stock || !category) {
      rm(photo.path, () => {
        console.log("Deleted");
      });
      return next(new ErrorHandler("Please enter all fields", 400));
    }

    const newProduct = await Product.create({
      name,
      price,
      stock,
      category: category.toLocaleLowerCase(),
      photo: photo?.path,
    });
   await invalidateCache({product:true});
    // // Clear the cache for the getProducts endpoint
    // nodeCache.del("getProducts");

    res.status(200).json({
      success: true,
      message: `Product , ${name} created successfully`,
      product: newProduct,
    });
  }
);

export const getProducts = TryCatch(
  async (
    req: Request<{}, {}, NewProductBody>,
    res: Response,
    next: NextFunction
  ) => {
    const cacheKey = "getProducts";
    const cachedData = nodeCache.get(cacheKey);

    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    const products = await Product.find({}).sort({ createdAt: -1 }).limit(5);

    // Cache the data for 60 seconds (adjust the duration as needed)
    nodeCache.set(cacheKey, { success: true, products }, 60);

    res.status(200).json({ success: true, products });
  }
);

export const getAllProducts = TryCatch(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, perPage = 10, search = "", category = "", minPrice = 0, maxPrice = Infinity } = req.query;
    const pageNumber = parseInt(page as string, 10);
    const pageSize = parseInt(perPage as string, 10);

    const cacheKey = `getAllProducts_${pageNumber}_${pageSize}_${search}_${category}_${minPrice}_${maxPrice}`;

    // Check if the data is already cached
    const cachedData = nodeCache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    const query: any = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    if (minPrice !== undefined && maxPrice !== undefined) {
      query.price = { $gte: minPrice, $lte: maxPrice };
    }

    const totalCount = await Product.countDocuments(query);
    const products = await Product.find(query)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    const data = {
      success: true,
      products,
      totalCount,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalCount / pageSize),
    };

    // Cache the data for 60 seconds (adjust the duration as needed)
    nodeCache.set(cacheKey, data, 60);

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

export const getAllCategories = TryCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      let categories: any;
      const cacheKey = "getCategories";
      if (nodeCache.has(cacheKey)) {
        categories = JSON.parse(nodeCache.get(cacheKey) as string);
      } else {
        categories = await Product.distinct("category");
        // Cache the data for 60 seconds (adjust the duration as needed)
        nodeCache.set(cacheKey, JSON.stringify(categories), 6000);
      }
  
      return res.status(200).json({
        success: true,
        categories,
      });
    }
  );

export const getAdminProducts = TryCatch(
  async (req: Request<{}, {}, NewProductBody>, res: Response, next: NextFunction) => {
    const cacheKey = "getAdminProducts";
    const cachedData = nodeCache.get(cacheKey);

    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    const products = await Product.find({});

    // Cache the data for 60 seconds (adjust the duration as needed)
    nodeCache.set(cacheKey, { success: true, products }, 60);

    res.status(200).json({
      success: true,
      products,
    });
  }
);

export const getSingleProducts = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const cacheKey = `getSingleProduct_${id}`;
  const cachedData = nodeCache.get(cacheKey);

  if (cachedData) {
    return res.status(200).json(cachedData);
  }

  const product = await Product.findById(id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // Cache the data for 60 seconds (adjust the duration as needed)
  nodeCache.set(cacheKey, { success: true, product }, 60);

  res.status(200).json({
    success: true,
    product,
  });
});

export const updateProduct = TryCatch(
  async (req: Request<{ id: string }, {}, NewProductBody>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { name, price, stock, category } = req.body;
      const photo = req.file;

      const product = await Product.findById(id);

      if (!product) {
        return next(new ErrorHandler("Product not found", 404));
      }

      if (!name || !price || !stock || !category) {
        return next(new ErrorHandler("Please enter all fields", 400));
      }

      // Update product details
      product.name = name;
      product.price = price;
      product.stock = stock;
      product.category = category.toLowerCase();

      // Update photo if provided
      if (photo) {
        // Delete previous photo
        rm(product.photo!, () => {
          console.log("Old photo deleted");
        });
        product.photo = photo.path;
      }

      await product.save();

      // Clear the cache for the getProducts and getAllProducts endpoints
      nodeCache.del("getProducts");
      nodeCache.del(`getAllProducts_*`);

      res.status(200).json({
        success: true,
        message: `Product ${name} updated successfully`,
        product,
      });
    } catch (error) {
      next(error);
    }
  }
);

export const deleteProduct = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) return next(new ErrorHandler("Product Not found", 404));

  rm(product.photo!, () => {
    console.log("Old photo deleted");
  });
  await product.deleteOne();

  // Clear the cache for the getProducts and getAllProducts endpoints
  nodeCache.del("getProducts");
  nodeCache.del(`getAllProducts_*`);

  return res.status(200).json({
    success: true,
    message: `Product ${product?.name} deleted successfully`,
  });
});