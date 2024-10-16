import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

export const auth = (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res
          .status(401)
          .json({ message: 'No token, authorization denied' });
      } else {
        return res.redirect('/login');
      }
    }

    jwt.verify(token, JWT_SECRET, (error, user) => {
      if (error) {
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
          return res.status(401).json({ message: 'Token is not valid' });
        } else {
          return res.redirect('/login');
        }
      }
      req.user = user;
      res.locals.user = user;
      next();
    });
  } catch (error) {
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.status(500).json({ message: error.message });
    } else {
      return res.status(500).render('error', { message: 'An error occurred' });
    }
  }
};
