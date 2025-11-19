import { Message } from "../Models/messageModel.js";
import { User } from "../Models/userModel.js";
import { Chat } from "../Models/chatModel.js";

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
export const allMessages = async (req, res) => {
  try {
    const {chatId}=req.body;
    const messages = await Message.find({ chat: chatId })
    .populate("sender","name image ")
    .populate("chat");
    res.status(200).json({success:true,messages});
  } catch (error) {
    res.status(400).json({success:false,msg:error.message});
  }
};

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
export const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;


  req.user = await User.findById(req.user._id);

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.status(200).json({success:false,msg:'Invalid data passed into request'});
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };
  

  try {
    
    var message = await Message.create(newMessage)
    message=await message.populate("sender", "name image")
    message=await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name image ",
    });

    await Chat.findByIdAndUpdate(req.body.chatID,{ latestMessage: message });
    res.status(200).json({success:true,message});
  } catch (error) {
    res.status(400).json({success:false,msg:error.message});
  }
};


