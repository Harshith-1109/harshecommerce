import mongoose from "mongoose";

const connectDb = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log(`successfully connected to mongo db 👍`);
    }
    catch (error){
        console.error(`Error : ${error.message}`);
        process.exit(1)
    }
}
export default connectDb;