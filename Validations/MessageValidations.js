import { body } from 'express-validator';

export const GetAllMessagesValidation = [
    body('chatId')
        .notEmpty().withMessage('chatId is required')
];

export const SendMessageValidation = [
    body('chatId')
        .notEmpty().withMessage('chatId is required'),
    body('content')
        .notEmpty().withMessage('content is required')
];

export const AccessChatValidations = [
    body('chatId')
        .notEmpty().withMessage('chatId is required')
];