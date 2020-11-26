import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

export class AuthMiddlewares {
  static local(request: Request, response: Response, next: NextFunction) {
    passport.authenticate('local', { session: false },
      (error, user, info) => {
        if (error) {
          return response.status(401).json({ message: error.message });
        }

        if (!user) {
          return response.status(401).json({ message: error.message });
        }

        request.user = user;
        return next();
      }
    )(request, response, next);
  };

  static bearer(request: Request, response: Response, next: NextFunction) {
    passport.authenticate('bearer', { session: false },
      (error, user, info) => {
        if (error && error.name === 'JsonWebTokenError') {
          return response.status(401).json({ message: error.message });
        }
        if (error) {
          return response.status(500).json({ message: error.message });
        }

        if (!user) {
          return response.status(401).json({ message: error.message });
        }

        request.Auhtorization = info;
        request.user = user;
        return next();
      })(request, response, next);
  };
}
