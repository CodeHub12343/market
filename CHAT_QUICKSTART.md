# Chat System Quick Start Guide

## ✅ What Has Been Created

### Library Files
1. **src/lib/api.js** - API client with chat and message endpoints
2. **src/lib/socket.js** - Socket.IO initialization and event handlers
3. **src/lib/queryClient.js** - React Query configuration

### Hook Files (6 hooks)
1. **useChats** - Fetch and list all chats with real-time updates
2. **useChatForm** - Create one-to-one and group chats
3. **useConversation** - Fetch single conversation and manage room
4. **useMessages** - Infinite scroll messages, send, delete, reactions
5. **useSearchUsers** - Search users with debounce
6. **useTyping** - Typing indicator state management

### Environment Config
- **.env.local** - Updated with Socket URL

## 🎬 Quick Start

### Step 1: Install Dependencies
```bash
npm install axios lodash
```

### Step 2: Copy Component Code

Copy the following JSX components into your `src/components/chat/` folder:

**Components needed:**
- ChatHeader.jsx
- ChatList.jsx
- MessageItem.jsx
- MessagesList.jsx
- MessagesInput.jsx
- TypingIndicator.jsx
- SearchUsers.jsx

**Layout component:**
- ChatLayout.jsx (in src/components/layout/)

### Step 3: Update Messages Pages

Update or create these pages:
- `src/app/(protected)/messages/page.js` - Messages list view
- `src/app/(protected)/messages/[chatId]/page.js` - Chat view

### Step 4: Wire Up Your App

In your main app wrapper (likely `src/app/layout.js` or similar):

```jsx
'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/lib/queryClient';
import { useEffect } from 'react';
import { initializeSocket, disconnectSocket } from '@/lib/socket';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
    -webkit-font-smoothing: antialiased;
  }
`;

export default function App({ children }) {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      initializeSocket();
    }
    return () => {
      disconnectSocket();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStyle />
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

## 📋 Component Code Snippets

### ChatList.jsx (updated)
This component should:
- Use `useChats()` hook to get chats
- Display chat list with avatars
- Show last message and timestamp
- Handle click to navigate to chat
- Show unread count if available

### ChatHeader.jsx
Displays:
- Chat name/title
- Member count or status
- Action buttons (call, video, etc.)

### MessagesList.jsx
Shows:
- Messages grouped by date
- Infinite scroll for older messages
- "Load More" button when hasNextPage
- Message time and status

### MessagesInput.jsx
Includes:
- Text input with auto-expand
- File attachment button
- Emoji picker
- Send button with disabled state

### SearchUsers.jsx
Features:
- Search modal overlay
- User list with avatars
- Click to create chat and navigate

## 🔌 Socket Events to Expect

Your backend should emit:
- `message:new:<chatId>` - New message in chat
- `userTyping` - User typing status
- `reactionAdded` - Emoji reaction added
- `reactionRemoved` - Emoji reaction removed
- `chat:created` - New chat created
- `chat:updated` - Chat updated

## 🚀 Testing

1. **Test message sending:**
   - Open two browser windows
   - Start a chat between two users
   - Send message, should appear instantly

2. **Test typing indicator:**
   - Start typing in input
   - Second user should see "User X is typing"

3. **Test reactions:**
   - Hover over message
   - Click emoji reaction
   - Should update instantly

4. **Test file upload:**
   - Click attachment button
   - Select file
   - Send message with attachment

## ⚠️ Common Issues

### Issue: "Socket not connected"
- Ensure backend is running on the SOCKET_URL
- Check token is in localStorage
- Check browser console for connection errors

### Issue: Messages not appearing
- Verify `NEXT_PUBLIC_API_URL` in .env.local
- Check backend API endpoint returns correct format
- Verify React Query cache keys match backend

### Issue: Real-time updates not working
- Ensure Socket.IO is properly configured on backend
- Verify socket event names match (case-sensitive)
- Check browser Network tab for WebSocket connection

## 📚 API Response Format Expected

### Get Messages Response
```json
{
  "status": "success",
  "data": [
    {
      "_id": "msg-id",
      "content": "Message text",
      "chat": "chat-id",
      "sender": {
        "_id": "user-id",
        "name": "User Name",
        "fullName": "Full Name",
        "photo": "url"
      },
      "attachments": [],
      "reactions": [],
      "readBy": [],
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pages": 5,
    "total": 234
  }
}
```

### Get Chats Response
```json
{
  "status": "success",
  "data": {
    "chats": [
      {
        "_id": "chat-id",
        "type": "one-to-one",
        "members": [],
        "lastMessage": "Last message text",
        "lastMessageAt": "2024-01-01T00:00:00Z",
        "unreadCount": 0,
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

## ✨ All Files Created

- ✅ src/lib/api.js
- ✅ src/lib/socket.js  
- ✅ src/lib/queryClient.js
- ✅ src/hooks/useChats.js
- ✅ src/hooks/useChatForm.js
- ✅ src/hooks/useConversation.js
- ✅ src/hooks/useMessages.js
- ✅ src/hooks/useSearchUsers.js
- ✅ src/hooks/useTyping.js
- ✅ .env.local (updated)

## 📝 Files Still to Create

**Copy from provided code into these locations:**
- src/components/chat/ChatHeader.jsx
- src/components/chat/ChatList.jsx
- src/components/chat/MessageItem.jsx
- src/components/chat/MessagesList.jsx
- src/components/chat/MessagesInput.jsx
- src/components/chat/TypingIndicator.jsx
- src/components/chat/SearchUsers.jsx
- src/components/layout/ChatLayout.jsx
- src/app/(protected)/messages/[chatId]/page.js

