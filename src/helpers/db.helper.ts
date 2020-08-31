import mongoose from "mongoose";
import { logger }  from "./logger.helper";

const connectMongoDB = (app:any) => {
    let dbUrl;
    const dbConf = {
        "hostname": process.env.MONGO_HOSTNAME,
        "port": process.env.MONGO_PORT,
        "username": process.env.MONGO_USERNAME,
        "password": process.env.MONGO_PASSWORD,
        "replicaSet": process.env.MONGO_RS,
        "dbName": process.env.MONGO_DB_NAME
    };
    if ((dbConf.username !== undefined || dbConf.password !== undefined) && (dbConf.username !== '' || dbConf.password !== '')) {
        dbUrl = `mongodb://${dbConf.username}:${dbConf.password}@${dbConf.hostname}:${dbConf.port}/${dbConf.dbName}?authSource=admin&w=1`;
        if (dbConf.replicaSet && dbConf.replicaSet !== '') {
            dbUrl += `&replicaSet=${dbConf.replicaSet}`;
        }
    } else {
        dbUrl = `mongodb://${dbConf.hostname}:${dbConf.port}/${dbConf.dbName}`;
    }
    mongoose.connect(dbUrl, {
        "useNewUrlParser": true,
        "useUnifiedTopology": true,
        'useCreateIndex': true,
        'useFindAndModify': false
    });
    mongoose.connection.once('open', () => {
        logger.info("Connected to MongoDB Successfully.");
    });
    mongoose.connection.on('connected', () => {
        logger.info('MongoDB connected');
    });
    mongoose.connection.on('disconnected', () => {
        logger.error("Mongodb is disconnected");
    });
    mongoose.connection.on('reconnected', () => {
        logger.info('MongoDB reconnected');
    });
    mongoose.connection.on('error', (error) => {
        logger.error(`MongoDB error :: ${error}`);
    });
};

export default connectMongoDB;