import mongoose from 'mongoose'
import { InvalidateCacheProps } from '../types/types.js';
import { nodeCache } from '../app.js';
import { Product } from '../models/products.js';
export const connectDB =(dbUrl: any, dbName: string | undefined)=>{
  
    mongoose.connect(dbUrl,{
        dbName: dbName
    }).then((c)=> console.log(`Db have been connected`))
    .catch((e)=> console.log(e));
}

export const invalidateCache = async({
    product,
    order,
    admin
}: InvalidateCacheProps) => {
  if(product){
    const productKeys: string[] = ["getCategories","getProducts"];

    const products = await Product.find({}).select("_id");
    products.forEach(i => {
        // const id = i._id;
        // `product-${id}`
        productKeys.push(`product-${i.id}`)
    });
    nodeCache.del(productKeys);
  }
  if(order){}
  if(admin){}
}
 