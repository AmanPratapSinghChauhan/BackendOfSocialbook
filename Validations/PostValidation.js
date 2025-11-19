import { body } from 'express-validator';
export const createPostValidation = [
// body('email')
//     .notEmpty().withMessage('Email is required')
//     .isEmail().withMessage('Invalid email format'),

// body('description')
//     .notEmpty().withMessage('Description is required')
//     .isLength({ min: 6 }).withMessage('Description must be at least 6 characters'),
//     body('profilepic')
//     .notEmpty().withMessage('ProfilePic is required')
//     ,
];

export const getAllPostsValidation = [
    body('pagesize')
        .notEmpty().withMessage('PageSize is required')
        .isInt(),
        body('pageindex')
        .notEmpty().withMessage('PageIndex is required')
        .isInt(),
];

export const likeValidation = [
    body('postId')
        .notEmpty().withMessage('Post Id is required')
];

export const GetPostsByIdsValidation = [
            body('ids')
                .notEmpty().withMessage('Ids is required')
               
                ];