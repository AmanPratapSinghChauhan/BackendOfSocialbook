import {Chat} from '../Models/chatModel.js';
import {User} from '../Models/userModel.js';
import _ from 'lodash';

//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
export const accessChat = async (req, res) => {

  req.user = await User.findById(req.user._id);
  
  const { chatId } = req.body;
  const userId=req.user._id;

  if (!chatId) {
    console.log("UserId param not sent with request");
    return res.json({success:true,msg:'User Id param not sent with request'});
  }
  var iChat= await Chat.find({
    $and:[
       {users: { $elemMatch: { $eq: userId } }} ,
      
       {users: { $elemMatch: { $eq: chatId } }} ]
    
  });
  var isChat = await Chat.find({
    $and:[
       {users: { $elemMatch: { $eq: userId } }} ,
      
       {users: { $elemMatch: { $eq: chatId } }} ]
    
  })
    .populate("users", "-password")
    .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name image email",
    });
  
   if (iChat.length > 0) {
  

    var FullChat=isChat[0];
    var sender;
    var reciever;
    var otherId=isChat[0].users[0]._id
    if(_.isEqual(userId,otherId)){
      sender ={name:isChat[0].users[0].name,
        image:isChat[0].users[0].image,};
      reciever={name:isChat[0].users[1].name,
          image:isChat[0].users[1].image,};
      
    }
    var otherId2=isChat[0].users[1]._id;
    if(_.isEqual(userId,otherId2)){
      sender={name:isChat[0].users[1].name,
        image:isChat[0].users[1].image,};
      reciever={name:isChat[0].users[0].name,
          image:isChat[0].users[0].image,};  
    }
    
   
    
    res.status(200).json({success:true,FullChat,sender,reciever});
   
  } else {
    var chatData = {
      chatName: "sender",
      users: [userId, chatId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json({success:true,FullChat})
    } catch (error) {
      res.status(400).json({success:false,msg:error.message});
      
    }
  }
};