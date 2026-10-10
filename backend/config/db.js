import mongoose from "mongoose";

const connectDb = async () => {
    try{
        await mongoose.connect(process.env.mongo_uri)
        console.log(`succesfully connected to mondo db 👍`);
        


    }
    catch (error){
        console.error(`Erroe : ${error.message}`);
        process.exit(1)

    }
}
 export default connectDb;
