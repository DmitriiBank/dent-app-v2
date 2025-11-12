import dotenv from 'dotenv';
dotenv.config();
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { UserDbModel } from '../schemas/user.schema';

console.log('🔧 GOOGLE OAuth Config:', {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'OK' : 'MISSING',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'OK' : 'MISSING',
    SERVER_URL: process.env.SERVER_URL,
    CALLBACK_URL: `${process.env.SERVER_URL || 'http://localhost:3555'}/api/v1/users/login/google/callback`
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: `${process.env.SERVER_URL || 'http://localhost:3555'}/api/v1/users/login/google/callback`,
        },
        async (_accessToken, _refreshToken, profile, done) => {
            try {
                console.log("🔍 Strategy called with profile:", {
                    id: profile?.id,
                    email: profile?.emails?.[0]?.value,
                    name: profile?.displayName
                });

                let user = await UserDbModel.findOne({ googleId: profile.id });

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
                } else {
                    console.log("✅ Existing user found:", user._id);
                }

                done(null, user);
            } catch (err) {
                console.error("🔥 GoogleStrategy error:", err);
                done(err as Error, undefined);
            }
        }
    )
);

passport.serializeUser((user: any, done) => {
    console.log("📦 Serializing user:", user._id);
    done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        console.log("📤 Deserializing user:", id);
        const user = await UserDbModel.findById(id);
        done(null, user);
    } catch (err) {
        console.error("🔥 Deserialize error:", err);
        done(err as Error, null);
    }
});