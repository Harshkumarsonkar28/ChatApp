const Message = require('../models/messageModel');

const Savemessage = async (req, res) => {
  const { sender, content, chatRoom } = req.body;
  try {
    const message = new Message({ sender, content, chatRoom });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getMessage = async (req, res) => {
  const { chatRoom } = req.params;
  try {
    const messages = await Message.find({ chatRoom }).populate('sender', 'username avatar').sort({ createdAt: 1 });
    res.json({ message: messages });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const editMessage = async(req,res)=>{
  const { id } = req.params;
  const { content } = req.body;
  try {
    const msg = await Message.findByIdAndUpdate(id,{content},{new:true})
    if(!msg){
      res.status(400).json({
        message:" NotUpdated Message"
      })

      res.status(200).json({
        message:"Updated Successfully "
      })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const deleteMessage = async(req,res)=>{
  const { id } = req.params;
  try {
    const message = await Message.findByIdAndDelete(id);
     if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.status(200).json({
      message: 'Message successfully deleted',
      deleted: message 
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { Savemessage, getMessage,deleteMessage,editMessage};
