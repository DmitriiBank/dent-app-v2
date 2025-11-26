import dotenv from 'dotenv';

dotenv.config();
import passport from 'passport';
import {Profile, Strategy as GoogleStrategy} from 'passport-google-oauth20';
import {UserDbModel} from '../schemas/user.schema';
import {GoogleJwtPayload} from "../utils/quizTypes";


export const configurePassport = () => {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID!,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
                callbackURL: `${process.env.SERVER_URL || 'http://localhost:3555'}/api/v1/auth/google/callback`,
                passReqToCallback: false
            },
            async (_token, _refreshToken, profile, done) => {
                try {
                    const user = await findOrCreateUser(profile);
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
        console.log("🔍 Strategy called with profile:", {
            id: profile?.id,
            email: profile?.emails?.[0]?.value,
            name: profile?.displayName
        });

        let user = await UserDbModel.findOne({googleId: profile.id});

        if (!user) {
            console.log("📝 Creating new user");
            user = await UserDbModel.create({
                name: profile.displayName,
                email: profile.emails?.[0].value,
                googleId: profile.id,
                avatar: profile.photos?.[0].value,
                provider: "google",
            });
            console.log("✅ User created:", user._id);
            console.log(user)
        }
        return user;
    } catch (err) {
        console.error("🔥 Google fetch user error:", err);
    }
};

export const findOrCreateGoogleUser = async (google: GoogleJwtPayload) => {
    let user = await UserDbModel.findOne({ email: google.email });

    if (!user) {
        user = await UserDbModel.create({
            name: google.name,
            email: google.email,
            googleId: google.sub,
            avatar: google.picture,
            provider: "google",
        });
    }

    return user;
};