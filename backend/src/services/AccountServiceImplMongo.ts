import {AccountService} from "./accountService";
import {HttpError} from "../errorHandler/HttpError";
import bcrypt from "bcryptjs";
import {logger} from "../Logger/winston";
import {UserDbModel} from "../schemas/user.schema";
import {User} from "../model/User";
import crypto from "crypto";
import * as tokenService from "../utils/jwt"
import jwt from "jsonwebtoken";



export class AccountServiceImplMongo implements AccountService {


    async signup(body: User): Promise<User>  {
        console.log(body)
        const isExists = await UserDbModel.findOne({email: body.email})
        if(isExists){
            throw new HttpError(400, `User with email ${body.email} already exists`);
        }
        return await UserDbModel.create(body);
    }

    async login(email: string, password: string): Promise<User> {
        const user = await UserDbModel.findOne({email}).select('+password');
        if (!user || !(await user.correctPassword(password, user.password)))
            throw new HttpError(401, "Incorrect email or password");
        console.log(user)
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
        return await user.save();
    };

    async updatePassword(userId: string, passwordCurrent: string, newPassword: string, newPasswordConfirm: string): Promise<User> {
        const user = await UserDbModel.findById(userId).select('+password');
        if (!user) {
            logger.error(`${new Date().toISOString()} => User with id ${userId} not found`);
            throw new HttpError(409, `User with id ${userId} not found`)
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
            return await user.save();
        } catch (e) {
            logger.error(`${new Date().toISOString()} => DB error on updatePassword (id=${userId}): ${e}`);
            throw new HttpError(500, "Failed to update password");
        }
    }

    async logout(token: string) {
        return await tokenService.removeToken(token);
    }

    async refresh(refreshToken: any) {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { id: string };
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!decoded || !tokenFromDb) {
            throw new HttpError(401, `Token with id ${tokenFromDb} not found`);
        }
        const user = await UserDbModel.findById(decoded.id);
        if (!user)throw new HttpError(401, 'User not found');
        return user;
    }
}

export const accountServiceImplMongo = new AccountServiceImplMongo()