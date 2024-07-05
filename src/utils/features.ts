import mongoose from 'mongoose'
export const connectDB =()=>{
  
    mongoose.connect("mongodb://localhost:27017/",{
        dbName: "gizmoGlaxy"
    }).then((c)=> console.log(`Db have been connected`))
    .catch((e)=> console.log(e));
}