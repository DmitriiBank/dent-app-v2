
import {HttpError} from "../errorHandler/HttpError";
import {User} from "../model/User";
import {UserDbModel} from "../schemas/user.schema";


export interface UserService {
    updateMe: (userId: string, filteredBody: any) => Promise<User>;
    deleteMe: (userId: string) =>  Promise<User>;
}

export class UserServiceImplMongo implements UserService {

    async updateMe(userId: string, filteredBody: any){
        const doc = await UserDbModel.findByIdAndUpdate(userId, filteredBody, {
                new: true,
                runValidators: true,
            })
        if (!doc) throw new HttpError(404, 'Document not found');
        return doc;
    }


    async deleteMe(userId: string) {
        const doc = await UserDbModel.findByIdAndUpdate(userId, {active: false});
        if (!doc) throw new HttpError(404, 'Document not found');
        return doc;
    }

}

export const userServiceImplMongo = new UserServiceImplMongo();