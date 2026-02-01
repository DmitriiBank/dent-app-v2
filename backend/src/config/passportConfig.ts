
import passport from 'passport';
import {Profile, Strategy as GoogleStrategy} from 'passport-google-oauth20';

import { logger } from "../Logger/winston";
import {UserDbModel} from '../schemas/user.schema';

import { env } from "./env";


// console.log('🔧 GOOGLE OAuth Config:', {
//     GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'OK' : 'MISSING',
//     GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'OK' : 'MISSING',
//     SERVER_URL: process.env.SERVER_URL,
//     CALLBACK_URL: `${process.env.SERVER_URL || 'http://localhost:3555'}/api/v1/users/login/google/callback`
// });
export const configurePassport = () => {
    if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
        logger.warn("Google OAuth not configured. Skipping Google strategy.");
        return;
    }
    passport.use(
        new GoogleStrategy(
            {
                clientID: env.GOOGLE_CLIENT_ID!,
                clientSecret: env.GOOGLE_CLIENT_SECRET!,
                callbackURL: `${env.SERVER_URL || 'http://localhost:3555'}/api/v1/auth/google/callback`,
                passReqToCallback: false
            },
            async (_token, _refreshToken, profile, done) => {
                try {
                    logger.info("Google OAuth profile received", {
                        id: profile?.id,
                        email: profile?.emails?.[0]?.value,
                        name: profile?.displayName
                    });

                    const user = await findOrCreateUser(profile)

                    done(null, user);
                } catch (err) {
                    console.error("🔥 GoogleStrategy error:", err);
                    done(err as Error, undefined);
                }
            }
        )
    );
}
// passport.serializeUser((user: any, done) => {
//     console.log("📦 Serializing user:", user._id);
//     done(null, user._id);
// });
//
// passport.deserializeUser(async (id: string, done) => {
//     try {
//         console.log("📤 Deserializing user:", id);
//         const user = await UserDbModel.findById(id);
//         done(null, user);
//     } catch (err) {
//         console.error("🔥 Deserialize error:", err);
//         done(err as Error, null);
//     }
// });

export const findOrCreateUser = async (profile: Profile) => {
    try {
        logger.info("Google OAuth profile received", {
            id: profile?.id,
            email: profile?.emails?.[0]?.value,
            name: profile?.displayName
        });

        let user = await UserDbModel.findOne({googleId: profile.id});

        if (!user) {
            logger.info("Creating new Google user");
            user = await UserDbModel.create({
                name: profile.displayName,
                email: profile.emails?.[0].value,
                googleId: profile.id,
                avatar: profile.photos?.[0].value,
                provider: "google",
            });
            logger.info("Google user created", { userId: user._id });
        }
        return user;
    } catch (err) {
        logger.error("Google fetch user error", err as Error);
    }
};