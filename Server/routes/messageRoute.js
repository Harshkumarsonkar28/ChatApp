const express = require('express');
const router = express.Router();
const { Savemessage, getMessage,deleteMessage,editMessage } = require('../controllers/messageController');

router.post('/', Savemessage);
router.get('/:chatRoom', getMessage);
router.put('/:id',editMessage);
router.delete('/:id',deleteMessage);
module.exports = router;
