import { Injectable } from "@nestjs/common";

@Injectable()
export class MongoConfigService {
    constructor() {};

    getConfig() {
        return {
            uri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/explore-may-2021',
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        }
    }
}