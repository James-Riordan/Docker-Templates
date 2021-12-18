import * as jwt from "jsonwebtoken";
import express from "express";

const { JWT_KEY } = process.env;

class AuthMiddleware {
  isAuth(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      req.isAuth = false;
      return next();
    }
    const token = authHeader.split(" ")[1];
    if (!token || token === "") {
      req.isAuth = false;
      return next();
    }
    try {
      let decodedToken = jwt.verify(token, JWT_KEY!);
      if (!decodedToken) {
        req.isAuth = false;
        return next();
      }
      req.isAuth = true;
      //req.userId = decodedToken.userId;
      next();
    } catch (err) {
      req.isAuth = false;
      return next();
    }
  }
}
export default new AuthMiddleware();
