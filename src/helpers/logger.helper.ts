import winston from "winston";

export const logger =  winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true
        }),
        new winston.transports.Console({
            level: 'info',
            handleExceptions: true
        })
    ],
    exitOnError: false
});

export const stream = {
    write(message:any, encoding:string){
        logger.info(message);
    }
};
