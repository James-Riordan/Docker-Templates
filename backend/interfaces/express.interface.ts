export {};
declare global {
  namespace Express {
    interface Request {
      isAuth: boolean;
      //userId: string;
    }
  }
}
