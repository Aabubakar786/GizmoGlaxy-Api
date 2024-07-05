import { NextFunction, Request, Response } from "express";
import { NewProductBody } from "../types/types.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "../middlewares/error.js";
import { Product } from "../models/products.js";
import { rm } from "fs";


export const createProducts = TryCatch(
    async (
        req: Request<{}, {}, NewProductBody>,
        res: Response,
        next: NextFunction) => {
        const { name, price, stock, category } = req.body;
        const photo = req.file;

        if (!photo) return next(new ErrorHandler("Please add photo", 400));
        if (!name || !price || !stock || !category) {
            rm(photo.path, () => {
                console.log("Deleted")
            })
            return next(new ErrorHandler("Please enter all fields", 400));
        }

        await Product.create({
            name,
            price,
            stock,
            category: category.toLocaleLowerCase(),
            photo: photo?.path
        })

        res.status(200).json({
            success: true,
            message: `Product , ${name} created successfully`
        })

    }
);


export const getProducts = TryCatch(
    async (
        req: Request<{}, {}, NewProductBody>,
        res: Response,
        next: NextFunction) => {
        const products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
        res.status(200).json({
            success: true,
            products
        })

    }
);


export const getAllProducts = TryCatch(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page = 1, perPage = 10, search = "", category = "", minPrice = 0, maxPrice = Infinity } = req.query;
      const pageNumber = parseInt(page as string, 10);
      const pageSize = parseInt(perPage as string, 10);
  
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
  
      res.status(200).json({
        success: true,
        products,
        totalCount,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalCount / pageSize),
      });
    } catch (error) {
      next(error);
    }
  });
  

export const getAllCategories = TryCatch(
    async (
        req: Request<{}, {}, {}>, // No need to specify NewProductBody here
        res: Response,
        next: NextFunction
    ) => {
        const categories = await Product.distinct("category");

        return res.status(200).json({
            success: true,
            categories,
        });
    }
);



export const getAdminProducts = TryCatch(
    async (
        req: Request<{}, {}, NewProductBody>,
        res: Response,
        next: NextFunction) => {

        const products = await Product.find({});
        res.status(200).json({
            success: true,
            products
        })

    }
);



export const getSingleProducts = TryCatch(
    async (req, res, next) => {

        const products = await Product.findById(req.params.id);
        res.status(200).json({
            success: true,
            products
        })

    }
);


export const updateProduct = TryCatch(
    async (req: Request<{ id: string }, {}, NewProductBody>, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params;
        const { name, price, stock, category } = req.body;
        const photo = req.file;
  
        const product = await Product.findById(id);
  
        if (!product) {
          return next(new ErrorHandler('Product not found', 404));
        }
  
        if (!name || !price || !stock || !category) {
          return next(new ErrorHandler('Please enter all fields', 400));
        }
  
        // Update product details
        product.name = name;
        product.price = price;
        product.stock = stock;
        product.category = category.toLowerCase();
  
        // Update photo if provided
        if (photo) {
          // Delete previous photo
           rm(product.photo!, ()=>{
            console.log('Old photo deleted')
           })
          product.photo = photo.path;
        }
  
        await product.save();
  
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
  

  export const deleteProduct = TryCatch(async(req,res,next)=>{
    const product = await Product.findById(req.params.id);
    if(!product) return next(new ErrorHandler("Product Not found", 404));

    rm(product.photo!, ()=>{
        console.log('Old photo deleted')
       })
    await Product.deleteOne();

    return res.status(200).json({
        success: true,
        message: `Product ${product?.name} deleted successfully`,
    })
  })