import express from 'express';
import { register, verify, login, logout, getMyProfile, forgetPassword, resetPassword, getAllUsers, addFriend, getUser, cancelRequest, friendAccept, deleteFriend, GetUserByIds } from '../Controllers/userController.js';
import singleUpload from '../middlewares/multer.js';
import { createpost, getAllPosts, GetPostsByIds, like, unlike } from '../Controllers/postController.js';
import { accessChat } from '../Controllers/chatController.js';
import { sendMessage, allMessages } from '../Controllers/messageController.js';
import { authenticate } from '../middlewares/AuthMiddleware.js';
import {
    registerValidation, loginValidation
    , verifyValidation, forgetValidation, resetValidation,
    getUserValidation, addFriendValidation, cancelRequestValidation, AcceptFriendValidation
    , deleteFriendValidation, findFriendsValidation,
    getAllUsersValidation
} from '../Validations/UserValidation.js';
import { validate } from '../middlewares/ValidateMiddleware.js';
import { createPostValidation, getAllPostsValidation, GetPostsByIdsValidation, likeValidation } from '../Validations/PostValidation.js';
import { AccessChatValidations, GetAllMessagesValidation, SendMessageValidation } from '../Validations/MessageValidations.js';

const router = express.Router();
router.route('/register').post(singleUpload, registerValidation, validate, register);
router.route('/verify').post(authenticate, verifyValidation, validate, verify);
router.route('/login').post(loginValidation, validate, login);
router.route('/logout').get(authenticate, logout);
router.route('/loaduser').post(authenticate, getMyProfile);
router.route('/forgetpassword').post(forgetValidation, validate, forgetPassword);
router.route('/resetpassword').put(resetValidation, validate, resetPassword);
router.route('/getallusers').post(authenticate, getAllUsersValidation, validate, getAllUsers);
router.route('/addFriend').post(authenticate, addFriendValidation, validate, addFriend);
router.route('/cancelRequest').post(authenticate, cancelRequestValidation, validate, cancelRequest);
router.route('/getuser').post(authenticate, getUserValidation, validate, getUser);
router.route('/acceptfriend').post(authenticate, AcceptFriendValidation, validate, friendAccept);
router.route('/deletefriend').post(authenticate, deleteFriendValidation, validate, deleteFriend);
router.route('/getUserByIds').post(authenticate, findFriendsValidation, validate, GetUserByIds);


router.route('/createpost').post(authenticate, createPostValidation, validate, singleUpload, createpost);
router.route('/getposts').post(authenticate, getAllPostsValidation, validate, getAllPosts);
router.route('/like').post(authenticate, likeValidation, validate, like);
router.route('/unlike').post(authenticate, likeValidation, validate, unlike);
router.route('/getPostsByIds').post(authenticate, GetPostsByIdsValidation, validate, GetPostsByIds);

// chat routes

router.route('/getchat').post(authenticate, AccessChatValidations, validate, accessChat);

// message routes
router.route('/getmessage').post(authenticate, GetAllMessagesValidation, validate, allMessages);
router.route('/sendmessage').post(authenticate, SendMessageValidation, validate, sendMessage);


export default router;