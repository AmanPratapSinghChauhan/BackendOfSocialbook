// middlewares/validate.js
import { validationResult } from 'express-validator';

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: false,
            msg: errors.array().map(err => err.msg) // Just send messages
        });
    }
    next();
};
