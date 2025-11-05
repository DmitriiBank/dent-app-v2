import { HttpError } from "../errorHandler/HttpError.js";
import bcrypt from "bcryptjs";
import { UserDbModel } from "../validators/user.schema.js";
export class AccountServiceImplMongo {
    async addAccount(user) {
        const temp = await UserDbModel.findById(user._id);
        if (temp)
            throw new HttpError(409, "User already exists");
        const userDoc = new UserDbModel(user);
        await userDoc.save();
        console.log("Registered ", userDoc);
    }
    async changePassword(id, newPassword) {
        const editUserPassword = await UserDbModel.findById(id);
        if (!editUserPassword)
            throw new HttpError(409, `User with id ${id} not found`);
        const isSame = await bcrypt.compare(newPassword, editUserPassword.password);
        if (isSame) {
            throw new HttpError(400, "The new password must not be the same as the old one");
        }
        const newPassHash = await bcrypt.hash(newPassword, 10);
        editUserPassword.password = newPassHash;
        await editUserPassword.save();
    }
    async changeUserData(id, newUserName, newEmail, newBirthdate) {
        const editUser = await UserDbModel.findById(id);
        if (!editUser)
            throw new HttpError(409, `User with id ${id} not found`);
        if (newUserName)
            editUser.name = newUserName;
        if (newEmail)
            editUser.email = newEmail;
        await editUser.save();
    }
    async changeUserRole(id, newRole) {
        const editUser = await UserDbModel.findById(id);
        if (!editUser)
            throw new HttpError(409, `User with id ${id} not found`);
        if (newRole)
            editUser.role = newRole;
        await editUser.save();
    }
    async getAccount(userID) {
        console.log(userID);
        const userById = await UserDbModel.findById(userID);
        if (!userById)
            throw new HttpError(404, `User with id ${userID} not found`);
        return userById;
    }
    async removeAccount(id) {
        const deleted = await UserDbModel.findByIdAndDelete(id);
        if (!deleted)
            throw new HttpError(404, `User with id ${id} not found`);
        return deleted;
    }
}
export const accountServiceImplMongo = new AccountServiceImplMongo();
