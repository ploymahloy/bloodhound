export type SessionUser = {
  id: string;
  email: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
};

declare global {
  namespace Express {
    // Passport attaches the authenticated user to req.user.
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface User extends SessionUser {}
  }
}

export {};
