import {AccountService} from "./accountService";
import {HttpError} from "../errorHandler/HttpError";
import bcrypt from "bcryptjs";
import {logger} from "../Logger/winston";
import {UserDbModel} from "../schemas/user.schema";
import {User} from "../model/User";
import crypto from "crypto";


export class AccountServiceImplMongo implements AccountService {


    async signup(body: User): Promise<User>  {
        const isExists = await UserDbModel.find({email: body.email})
        if(isExists){
            throw new HttpError(400, `User with email ${body.email} already exists`);
        }
        const res = await UserDbModel.create(body);
        return res;
    }

    async login(email: string, password: string): Promise<User> {
        const user = await UserDbModel.findOne({email}).select('+password');
        if (!user || !(await user.correctPassword(password, user.password)))
            throw new HttpError(401, "Incorrect email or password");
        return user;
    }

    async resetPassword(token: string, password: string, passwordConfirm: string): Promise<User> {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await UserDbModel.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: {$gt: Date.now()},
        });

        if (!user) {
            throw new HttpError(400, 'Token is invalid or has expired');
        }
        user.password = password;
        user.passwordConfirm = passwordConfirm;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        const res = await user.save();
        return res;

    };

    async updatePassword(userId: string, passwordCurrent: string, newPassword: string, newPasswordConfirm: string): Promise<User> {
        const user = await UserDbModel.findById(userId).select('+password');
        if (!user) {
            logger.error(`${new Date().toISOString()} => Employee with id ${userId} not found`);
            throw new HttpError(409, `Employee with id ${userId} not found`)
        }
        const isCorrect = await user.correctPassword(passwordCurrent, user.password);
        if (!isCorrect) {
            throw new HttpError(401, 'Your current password is incorrect.');
        }
        const isSame = await bcrypt.compare(newPasswordConfirm, user.password);
        if (isSame) {
            logger.error(`${new Date().toISOString()} => New password equals old (id=${userId})`);
            throw new HttpError(400, "The new password must not be the same as the old one");
        }
        try {
            user.password = newPassword;
            user.passwordConfirm = newPasswordConfirm;
            const res = await user.save();
            return res;
        } catch (e) {
            logger.error(`${new Date().toISOString()} => DB error on updatePassword (id=${userId}): ${e}`);
            throw new HttpError(500, "Failed to update password");
        }
    }




}

export const accountServiceImplMongo = new AccountServiceImplMongo()