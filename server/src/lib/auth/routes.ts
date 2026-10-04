import { Router, type Request, type Response, type NextFunction } from "express";
import passport from "passport";

const frontendUrl = () => process.env.FRONTEND_URL || "http://localhost:5173";

const googleConfigured = () =>
  Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_CALLBACK_URL);

export const createAuthRouter = () => {
  const router = Router();

  router.get("/google", (req: Request, res: Response, next: NextFunction) => {
    if (!googleConfigured()) {
      res.redirect(`${frontendUrl()}/login?error=1`);
      return;
    }
    passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
  });

  router.get(
    "/google/callback",
    (req: Request, res: Response, next: NextFunction) => {
      if (!googleConfigured()) {
        res.redirect(`${frontendUrl()}/login?error=1`);
        return;
      }
      passport.authenticate("google", {
        failureRedirect: `${frontendUrl()}/login?error=1`,
        session: true,
      })(req, res, next);
    },
    (_req: Request, res: Response) => {
      res.redirect(frontendUrl());
    }
  );

  router.post("/logout", (req: Request, res: Response, next: NextFunction) => {
    req.logout((logoutError) => {
      if (logoutError) {
        next(logoutError);
        return;
      }
      req.session.destroy((sessionError) => {
        if (sessionError) {
          next(sessionError);
          return;
        }
        res.clearCookie("bloodhound.sid");
        res.status(200).json({ status: "ok" });
      });
    });
  });

  return router;
};
