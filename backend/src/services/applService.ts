import {Document, Model} from "mongoose";

export interface ApplService {
    getAll<T extends Document>(dbModel: Model<T>, query: any): Promise<T[]>;
    getOne<T extends Document>(dbModel: Model<T>, id: string, popOptions?: any): Promise<T>;
    createOne<T extends Document>(dbModel: Model<T>, body: any): Promise<T>;
    updateOne<T extends Document>(dbModel: Model<T>, id: string, body: any): Promise<T>;
    deleteOne<T extends Document>(dbModel: Model<T>, id: string): Promise<T>;
}