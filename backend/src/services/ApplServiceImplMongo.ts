import {Document, Model} from "mongoose";
import {APIFeatures} from "../utils/apiFeatures";
import {logger} from "../Logger/winston";
import {HttpError} from "../errorHandler/HttpError";
import {ApplService} from "./applService";

type FeaturesFactory = <T>(query: any, queryString: any) => APIFeatures<T>;

export class ApplServiceImplMongo implements ApplService {

    constructor(private readonly createFeatures: FeaturesFactory =
                (query, queryString) => new APIFeatures(query, queryString)) {}

    async getAll<T extends Document>(dbModel: Model<T>, query: any): Promise<T[]> {
        const features = this.createFeatures<T>(dbModel.find(), query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        return await features.query;
    }

    async getOne<T extends Document>(dbModel: Model<T>, id: string, popOptions?: any): Promise<T> {
        let query = dbModel.findById(id);
        if (popOptions) query = query.populate(popOptions);
        const doc = await query;
        if (!doc) {
            logger.error(`${new Date().toISOString()} => Document with id ${id} not found`);
            throw new HttpError(404, `Document with id ${id} not found`);
        }
        return doc;
    }

    async createOne<T extends Document>(dbModel: Model<T>, body: any): Promise<T> {
        const doc = dbModel.create(body);
        if (!doc) {
            logger.error(`${new Date().toISOString()} => Document does not create`);
            throw new HttpError(404, `Document does not create`);
        }
        return doc;
    }

    async updateOne<T extends Document>(dbModel: Model<T>, id: string, body: any): Promise<T> {
        const doc = await dbModel.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });
        if (!doc) throw new HttpError(404, 'Document not found');
        return doc;
    }

    async deleteOne<T extends Document>(dbModel: Model<T>, id: string): Promise<T> {
        const doc = await dbModel.findByIdAndDelete(id)
        if (!doc) throw new HttpError(404, 'Document not found');
        return doc;
    }
}

export const applServiceImplMongo = new ApplServiceImplMongo()