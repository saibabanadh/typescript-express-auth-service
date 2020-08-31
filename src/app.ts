// Add module dependencies
import fs from "fs";
import dotenv from "dotenv";
import express, {Request, Response} from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mkdirp from "mkdirp";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";

import { logger } from "./helpers/logger.helper";
import connectMongoDB from "./helpers/db.helper";

// Load .env
dotenv.config();

const APP_NAME = process.env.APP_NAME;
const PORT = process.env.PORT;
const API_BASE = process.env.API_BASE;
const LogStreamFilePath = process.env.LogStreamFilePath;

// routes
import { authRouter } from "./routes/auth.routes";
import { userRouter } from "./routes/user.routes";

export class App {
    private app = express.application;

    constructor(){
        this.app = express();

        // MongoDB Connection
        connectMongoDB(this.app);

        // Creating dependent folders
        mkdirp.sync(`${LogStreamFilePath}`);

        // body parser
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));

        // setup the logger
        const accessLogStream = fs.createWriteStream(`${LogStreamFilePath}/${'access.log'}`, { flags: 'a' });
        this.app.use(morgan('combined', { stream: accessLogStream }));

        // request/response headers
        this.app.use((req, res, next) => {
            logger.info(`Incoming request from ${req.headers.host} and requested for ${req.url}`)
            req.setTimeout(100000); // 10 secs
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', ['POST', 'GET']);
            res.setHeader('Access-Control-Allow-Header', ['X-Requested-With', 'content-type', 'Authorization']);
            res.setTimeout(300000, () => {
                logger.error(`Request has timed out.`);
                res.status(408).json({ success: false, message: "Request has timed out." });
            });
            next();
        });
        this.app.use(cors());
        this.app.use(helmet());
        this.app.use(helmet.xssFilter());
        this.app.use(helmet.frameguard());
        this.app.use(helmet.hidePoweredBy());

        // Add swagger api-docs
        const options = {
            customCss: '.swagger-ui .topbar { display: none }'
        };
        this.app.use(`${API_BASE}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

        // Add routes
        this.app.get(`${API_BASE}/`, (req: Request, res: Response) =>{
            return res.status(200).json({
                message:"Success.!, Auth Service is Running.!"
            });
        });
        this.app.use(`${API_BASE}/auth`, authRouter);
        this.app.use(`${API_BASE}/users`, userRouter);

        // Hanlde uncaughtExceptions here to prevent termination
        process.on('uncaughtException', (error) => {
            logger.error(error);
        });

        // Run the microservice
        this.app.listen(PORT, () => {
            logger.info(`${APP_NAME} is running on ${PORT} Port`);
        });
    }
}
