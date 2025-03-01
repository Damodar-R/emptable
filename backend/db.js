const mongoose=require('mongoose');

const connectDB=async()=>{
    try{
        const conn = await mongoose.connect('mongodb+srv://damodharr57:DAmu1234@cluster0.0i81g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

        console.log('mongoDB connected:${conn.connection.host}');
    }catch(error){
        console.error(error);
        process.exit(1);
    
    }
};
module.exports=connectDB;