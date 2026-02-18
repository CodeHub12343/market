# Socket.IO Real-Time Messaging Setup

## Client-Side (Already Implemented ✅)

The client is now set up to:
- ✅ Connect to Socket.IO server on app load (via `Providers.jsx`)
- ✅ Listen for real-time message events: `message:new:{conversationId}`
- ✅ Listen for message updates: `message:update:{conversationId}`
- ✅ Listen for message deletions: `message:delete:{conversationId}`
- ✅ Emit `message:sent` events after messages are sent
- ✅ Automatically update UI when new messages arrive (no polling delay)

## Backend Setup Required

Your backend (Express/Node.js) needs to:

### 1. Install Socket.IO

```bash
npm install socket.io
```

### 2. Initialize Socket.IO in Your Server

```javascript
// In your main server file (e.g., server.js or app.js)
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  },
  path: '/socket.io/',
});

// Your existing express middleware
app.use(cors());
app.use(express.json());

// =========================================
// Socket.IO Connection Handling
// =========================================
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  // User joins a conversation room
  socket.on('join:conversation', (conversationId) => {
    socket.join(`conversation:${conversationId}`);
    console.log(`👤 User ${socket.id} joined conversation:${conversationId}`);
  });

  // User leaves a conversation room
  socket.on('leave:conversation', (conversationId) => {
    socket.leave(`conversation:${conversationId}`);
    console.log(`👤 User ${socket.id} left conversation:${conversationId}`);
  });

  // New message sent
  socket.on('message:sent', (data) => {
    const { conversationId, content } = data;
    console.log('💬 Message sent in conversation:', conversationId);
    
    // Broadcast to all users in this conversation
    io.to(`conversation:${conversationId}`).emit(`message:new:${conversationId}`, {
      _id: new Date().getTime().toString(),
      content,
      text: content,
      chat: conversationId,
      createdAt: new Date().toISOString(),
      // Include actual message data from your database after saving
    });
  });

  // Message updated
  socket.on('message:update', (data) => {
    const { conversationId, messageId, content } = data;
    io.to(`conversation:${conversationId}`).emit(`message:update:${conversationId}`, {
      _id: messageId,
      content,
      text: content,
    });
  });

  // Message deleted
  socket.on('message:delete', (data) => {
    const { conversationId, messageId } = data;
    io.to(`conversation:${conversationId}`).emit(`message:delete:${conversationId}`, messageId);
  });

  // Typing indicator
  socket.on('user:typing', (data) => {
    const { conversationId, userId, isTyping } = data;
    socket.to(`conversation:${conversationId}`).emit('user:typing', {
      userId,
      isTyping
    });
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

// Your existing routes
app.use('/api/v1', routes);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

### 3. Update Message Creation Endpoint

After saving a message to the database, emit it via Socket.IO:

```javascript
// In your message controller/route
router.post('/chats/:conversationId/messages', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    // Save message to database
    const message = new Message({
      chat: conversationId,
      sender: userId,
      content,
      createdAt: new Date()
    });
    
    await message.save();

    // Populate sender data
    await message.populate('sender', 'fullName email photo isOnline');

    // IMPORTANT: Emit to all users in the conversation
    io.to(`conversation:${conversationId}`).emit(`message:new:${conversationId}`, message);

    res.json({
      status: 'success',
      data: message
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

## How It Works

1. **Client Connects**: When app loads, Socket.IO connects automatically
2. **Join Conversation**: When user opens a conversation, they join the conversation room
3. **Send Message**: 
   - User clicks send → optimistic update shows immediately
   - API request is sent
   - On success, `message:sent` event emitted to server
4. **Server Receives**: Server receives `message:sent` and broadcasts to all users in that conversation
5. **Real-Time Update**: All connected clients receive the new message via `message:new:{conversationId}`
6. **Fallback**: If Socket.IO fails, polling still works (refetch every 30s)

## Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

The Socket.IO connection uses this same URL automatically.

## Testing

1. Open the chat in two different browser windows/tabs
2. Send a message in one window
3. You should see it appear immediately in the other window (no 3-second delay!)

## Events Reference

### Client Emits
- `join:conversation` - Join a conversation room
- `leave:conversation` - Leave a conversation room
- `message:sent` - Notify server a message was sent
- `user:typing` - Notify users you're typing

### Server Broadcasts (Client Listens)
- `message:new:{conversationId}` - New message in conversation
- `message:update:{conversationId}` - Message edited
- `message:delete:{conversationId}` - Message deleted
- `user:typing` - User is typing indicator

## Troubleshooting

### Messages still not showing in real-time?
1. Check browser console for connection logs (should show ✅ Socket.IO connected)
2. Verify backend is using `io.to('conversation:${conversationId}').emit()`
3. Ensure backend Socket.IO is initialized before express routes
4. Check CORS settings match your client URL

### Socket.IO not connecting?
1. Verify `NEXT_PUBLIC_API_URL` matches your backend URL
2. Check backend is running on the correct port
3. Verify Socket.IO path is `/socket.io/`
4. Check firewall/network allows WebSocket connections

### High latency?
- Socket.IO will fallback to polling if WebSocket unavailable
- Use `transports: ['websocket']` (client-side) to force WebSocket only
- Update in `/src/lib/socket.js` if needed
