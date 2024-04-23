import mongoose, { MongooseError } from "mongoose";

type ConnectionObject = {
    isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already DB is connected");
    } else {
        try {
            const db = await mongoose.connect(process.env.MONGO_URI || '');
            connection.isConnected = db.connections[0].readyState;
            console.log("DB connected succesfully");
        } catch (error) {
            throw new MongooseError("Couldn't connect to database");
        };
    };
};

export default dbConnect;