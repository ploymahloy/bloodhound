import passport from "passport";
import { Strategy as GoogleStrategy, type Profile } from "passport-google-oauth20";
import { findOrCreateGoogleUser, findUserById } from "./users";
import type { SessionUser } from "./types";

export const configurePassport = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await findUserById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const callbackURL = process.env.GOOGLE_CALLBACK_URL;

  if (!clientID || !clientSecret || !callbackURL) {
    console.warn(
      "Google OAuth is not configured. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_CALLBACK_URL."
    );
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID,
        clientSecret,
        callbackURL,
      },
      async (_accessToken, _refreshToken, profile: Profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            done(new Error("Google account has no email"));
            return;
          }

          const user = await findOrCreateGoogleUser({
            googleId: profile.id,
            email,
            firstName: profile.name?.givenName ?? null,
            lastName: profile.name?.familyName ?? null,
          });
          done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );
};

export const toPublicUser = (user: SessionUser) => ({
  id: user.id,
  email: user.email,
  username: user.username,
  firstName: user.firstName,
  lastName: user.lastName,
});
