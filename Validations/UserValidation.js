// validations/userValidation.js
import { body } from 'express-validator';

export const registerValidation = [
    body('name')
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),

    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('gender')
        .notEmpty().withMessage('Gender is required')
        ,
        body('date')
        .notEmpty().withMessage('Dob is required')
        .isDate()
];


export const loginValidation = [
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

export const verifyValidation = [
    body('otp')
        .notEmpty().withMessage('Otp is required')
        .isLength({min:6, max:6}).withMessage('Otp must be 6 characters long '),
];

export const getUserValidation = [
    body('userId')
        .notEmpty().withMessage('UserId is required')
];

export const getAllUsersValidation = [
    body('pagesize')
        .notEmpty().withMessage('PageSize is required')
        .isInt(),
        body('pageindex')
        .notEmpty().withMessage('PageIndex is required')
        .isInt(),
];

export const forgetValidation = [
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),
];

export const resetValidation = [
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

export const addFriendValidation= [
        body('friendId')
        .notEmpty().withMessage('friendId is required')
];

export const cancelRequestValidation= [
        body('friendId')
        .notEmpty().withMessage('friendId is required')
        ,];

export const deleteFriendValidation= [
        body('friendId')
        .notEmpty().withMessage('friendId is required')
        ,];

        export const findFriendsValidation= [
            body('ids')
                .notEmpty().withMessage('Ids is required')
               
                ,];

        export const AcceptFriendValidation= [
                body('friendId')
                .notEmpty().withMessage('friendId is required')
                ,];
                

