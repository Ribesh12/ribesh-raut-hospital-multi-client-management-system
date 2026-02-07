import Chat from './models/chat.model.js';

// Store connected users and admins
const connectedUsers = new Map(); // sessionId -> socketId
const connectedAdmins = new Map(); // hospitalId -> [socketIds]

export const setupSocketIO = (io) => {
  io.on('connection', (socket) => {
    console.log('New socket connection:', socket.id);

    // Super admin joins for real-time updates
    socket.on('superAdmin:join', () => {
      socket.join('super-admin');
      socket.isSuperAdmin = true;
      console.log(`Super admin joined room: super-admin`);
    });

    // User joins a hospital chat room
    socket.on('user:join', ({ hospitalId, sessionId }) => {
      socket.join(`hospital:${hospitalId}`);
      socket.join(`session:${sessionId}`);
      connectedUsers.set(sessionId, socket.id);
      
      socket.hospitalId = hospitalId;
      socket.sessionId = sessionId;
      socket.isAdmin = false;
      
      console.log(`User ${sessionId} joined hospital ${hospitalId}`);
    });

    // Admin joins their hospital room
    socket.on('admin:join', ({ hospitalId, adminId }) => {
      socket.join(`hospital:${hospitalId}`);
      socket.join(`admin:${hospitalId}`);
      
      if (!connectedAdmins.has(hospitalId)) {
        connectedAdmins.set(hospitalId, []);
      }
      connectedAdmins.get(hospitalId).push(socket.id);
      
      socket.hospitalId = hospitalId;
      socket.adminId = adminId;
      socket.isAdmin = true;
      
      console.log(`Admin ${adminId} joined hospital ${hospitalId}`);
      
      // Notify admin of waiting chats
      notifyAdminOfWaitingChats(io, hospitalId);
    });

    // User sends message
    socket.on('user:message', async ({ hospitalId, sessionId, message, chatType }) => {
      try {
        // Add message to database
        const chat = await Chat.findOneAndUpdate(
          { hospitalId, sessionId },
          {
            $push: {
              messages: {
                role: 'user',
                content: message,
                timestamp: new Date(),
                readByAdmin: false,
                readByUser: true,
              },
            },
            $set: { lastActivity: new Date() },
          },
          { new: true }
        );

        if (chat && chat.chatType === 'human') {
          // Emit to admins
          io.to(`admin:${hospitalId}`).emit('chat:newMessage', {
            chatId: chat._id,
            sessionId,
            message: {
              role: 'user',
              content: message,
              timestamp: new Date(),
            },
          });

          // Notify waiting chats update
          notifyAdminOfWaitingChats(io, hospitalId);
        }
      } catch (error) {
        console.error('Error handling user message:', error);
      }
    });

    // Admin sends message
    socket.on('admin:message', async ({ chatId, message }) => {
      try {
        const chat = await Chat.findByIdAndUpdate(
          chatId,
          {
            $push: {
              messages: {
                role: 'admin',
                content: message,
                timestamp: new Date(),
                readByAdmin: true,
                readByUser: false,
              },
            },
            $set: { lastActivity: new Date() },
          },
          { new: true }
        );

        if (chat) {
          // Emit to user
          io.to(`session:${chat.sessionId}`).emit('chat:newMessage', {
            chatId: chat._id,
            message: {
              role: 'admin',
              content: message,
              timestamp: new Date(),
            },
          });
        }
      } catch (error) {
        console.error('Error handling admin message:', error);
      }
    });

    // Admin accepts chat
    socket.on('admin:accept', async ({ chatId }) => {
      try {
        const chat = await Chat.findByIdAndUpdate(
          chatId,
          {
            $set: {
              status: 'active',
              assignedAdmin: socket.adminId,
            },
            $push: {
              messages: {
                role: 'admin',
                content: 'An agent has joined the chat. How can we help you today?',
                timestamp: new Date(),
                readByUser: false,
              },
            },
          },
          { new: true }
        );

        if (chat) {
          // Notify user
          io.to(`session:${chat.sessionId}`).emit('chat:adminJoined', {
            chatId: chat._id,
          });

          io.to(`session:${chat.sessionId}`).emit('chat:newMessage', {
            chatId: chat._id,
            message: {
              role: 'admin',
              content: 'An agent has joined the chat. How can we help you today?',
              timestamp: new Date(),
            },
          });

          // Update waiting chats for all admins
          notifyAdminOfWaitingChats(io, chat.hospitalId);
        }
      } catch (error) {
        console.error('Error accepting chat:', error);
      }
    });

    // Admin closes chat
    socket.on('admin:close', async ({ chatId }) => {
      try {
        const chat = await Chat.findByIdAndUpdate(
          chatId,
          {
            $set: { status: 'closed' },
            $push: {
              messages: {
                role: 'assistant',
                content: 'This chat has been closed. Thank you for contacting us!',
                timestamp: new Date(),
              },
            },
          },
          { new: true }
        );

        if (chat) {
          // Notify user
          io.to(`session:${chat.sessionId}`).emit('chat:closed', {
            chatId: chat._id,
          });

          // Update waiting chats
          notifyAdminOfWaitingChats(io, chat.hospitalId);
        }
      } catch (error) {
        console.error('Error closing chat:', error);
      }
    });

    // User requests human chat
    socket.on('user:requestHuman', async ({ hospitalId, sessionId, userName, userEmail }) => {
      try {
        let chat = await Chat.findOne({ hospitalId, sessionId });

        if (!chat) {
          chat = new Chat({
            hospitalId,
            sessionId,
            userName: userName || 'Guest',
            userEmail: userEmail || '',
            chatType: 'human',
            status: 'waiting',
            messages: [{
              role: 'assistant',
              content: 'You have requested to chat with our support team. Please wait while we connect you with an available agent.',
              timestamp: new Date(),
            }],
          });
        } else {
          chat.chatType = 'human';
          chat.status = 'waiting';
          chat.userName = userName || chat.userName;
          chat.userEmail = userEmail || chat.userEmail;
          chat.messages.push({
            role: 'assistant',
            content: 'You have requested to chat with our support team. Please wait while we connect you with an available agent.',
            timestamp: new Date(),
          });
        }

        chat.lastActivity = new Date();
        await chat.save();

        // Notify admins of new waiting chat
        io.to(`admin:${hospitalId}`).emit('chat:newWaiting', {
          chatId: chat._id,
          sessionId,
          userName: chat.userName,
          userEmail: chat.userEmail,
        });

        notifyAdminOfWaitingChats(io, hospitalId);

        // Confirm to user
        socket.emit('chat:humanRequested', {
          chatId: chat._id,
          status: 'waiting',
        });
      } catch (error) {
        console.error('Error requesting human chat:', error);
      }
    });

    // Typing indicators
    socket.on('user:typing', ({ hospitalId, sessionId }) => {
      io.to(`admin:${hospitalId}`).emit('chat:userTyping', { sessionId });
    });

    socket.on('admin:typing', ({ chatId, sessionId }) => {
      io.to(`session:${sessionId}`).emit('chat:adminTyping', { chatId });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);

      if (socket.sessionId) {
        connectedUsers.delete(socket.sessionId);
      }

      if (socket.isAdmin && socket.hospitalId) {
        const adminSockets = connectedAdmins.get(socket.hospitalId) || [];
        const index = adminSockets.indexOf(socket.id);
        if (index > -1) {
          adminSockets.splice(index, 1);
        }
      }
    });
  });
};

// Helper to notify admins of waiting chats
const notifyAdminOfWaitingChats = async (io, hospitalId) => {
  try {
    const waitingChats = await Chat.find({
      hospitalId,
      chatType: 'human',
      status: { $in: ['waiting', 'active'] },
    }).sort({ lastActivity: -1 });

    const chatList = waitingChats.map(chat => ({
      _id: chat._id,
      sessionId: chat.sessionId,
      userName: chat.userName,
      userEmail: chat.userEmail,
      status: chat.status,
      lastActivity: chat.lastActivity,
      unreadCount: chat.messages.filter(m => m.role === 'user' && !m.readByAdmin).length,
      lastMessage: chat.messages[chat.messages.length - 1],
    }));

    io.to(`admin:${hospitalId}`).emit('chat:waitingList', chatList);
  } catch (error) {
    console.error('Error notifying admin of waiting chats:', error);
  }
};
