import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import { UserDbModel } from '../schemas/user.schema';

dotenv.config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: `${process.env.SERVER_URL || 'http://localhost:3555'}/api/v1/users/login/google/callback`,
        },
        async (_accessToken, _refreshToken, profile, done) => {
            try {
                let user = await UserDbModel.findOne({ googleId: profile.id });

                if (!user && profile.emails?.[0]?.value) {
                    user = await UserDbModel.findOne({ email: profile.emails[0].value });
                }

                if (!user) {
                    user = await UserDbModel.create({
                        name: profile.displayName,
                        email: profile.emails?.[0].value,
                        googleId: profile.id,
                        avatar: profile.photos?.[0].value,
                        provider: 'google',
                    });
                } else if (!user.googleId) {
                    user.googleId = profile.id;
                    user.provider = 'google';
                    await user.save();
                }

                return done(null, user);
            } catch (err) {
                return done(err, undefined);
            }
        }
    )
);

passport.serializeUser((user: any, done) => done(null, user.id));
passport.deserializeUser(async (id: string, done) => {
    const user = await UserDbModel.findById(id);
    done(null, user);
});
