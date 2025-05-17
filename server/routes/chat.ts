import { Router } from 'express';
import { storage } from '../storage';
import { WebSocket, WebSocketServer } from 'ws';
import { Server } from 'http';

const router = Router();

// Get messages between two users
router.get('/messages/:senderId/:receiverId', async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;
    const messages = await storage.getMessages(
      parseInt(senderId),
      parseInt(receiverId)
    );
    
    res.json(messages);
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create a new message
router.post('/messages', async (req, res) => {
  try {
    const message = req.body;
    const savedMessage = await storage.createMessage(message);
    
    res.status(201).json(savedMessage);
  } catch (error: any) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: error.message });
  }
});

// Mark messages as read
router.put('/messages/read', async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    await storage.markMessagesAsRead(senderId, receiverId);
    
    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ error: error.message });
  }
});

// Setup WebSocket for real-time chat
export function setupChatWebSocket(httpServer: Server) {
  const wss = new WebSocketServer({ server: httpServer, path: '/ws/chat' });
  
  // Store connected clients
  const clients = new Map<number, WebSocket>();
  
  wss.on('connection', (ws, req) => {
    console.log('WebSocket client connected');
    
    let userId: number | null = null;
    
    // Handle authentication and assign userId from query params or cookies
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const userIdParam = url.searchParams.get('userId');
    
    if (userIdParam) {
      userId = parseInt(userIdParam);
      clients.set(userId, ws);
      console.log(`User ${userId} connected to chat`);
    } else {
      console.log('WebSocket connection rejected: No userId provided');
      ws.close(1008, 'Authentication required');
      return;
    }
    
    // Handle messages from client
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log(`Received message from user ${userId}:`, data);
        
        if (data.type === 'message') {
          // Save message to database
          const savedMessage = await storage.createMessage({
            senderId: userId!,
            receiverId: data.receiverId,
            groupId: data.groupId,
            text: data.text
          });
          
          // If there are attachments, save them
          let attachments = [];
          if (data.attachments && data.attachments.length > 0) {
            for (const attachment of data.attachments) {
              const savedAttachment = await storage.createAttachment({
                messageId: savedMessage.id,
                name: attachment.name,
                type: attachment.type,
                url: attachment.url,
                size: attachment.size
              });
              attachments.push(savedAttachment);
            }
          }
          
          // Send message to recipient if online
          if (data.receiverId && clients.has(data.receiverId)) {
            const recipientWs = clients.get(data.receiverId);
            if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
              recipientWs.send(JSON.stringify({
                type: 'message',
                message: savedMessage
              }));
            }
          }
          
          // Send to group members if it's a group message
          if (data.groupId) {
            // In a real app, would fetch group members from database
            // For now, broadcast to all connected clients
            clients.forEach((clientWs, clientId) => {
              if (clientId !== userId && clientWs.readyState === WebSocket.OPEN) {
                clientWs.send(JSON.stringify({
                  type: 'message',
                  message: savedMessage
                }));
              }
            });
          }
          
          // Confirm message received
          ws.send(JSON.stringify({
            type: 'message_sent',
            messageId: savedMessage.id
          }));
        }
        
        else if (data.type === 'typing') {
          // Notify recipient that user is typing
          if (data.receiverId && clients.has(data.receiverId)) {
            const recipientWs = clients.get(data.receiverId);
            if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
              recipientWs.send(JSON.stringify({
                type: 'typing',
                senderId: userId
              }));
            }
          }
        }
        
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Failed to process message'
        }));
      }
    });
    
    // Handle disconnection
    ws.on('close', () => {
      if (userId) {
        console.log(`User ${userId} disconnected from chat`);
        clients.delete(userId);
      }
    });
    
    // Send welcome message
    ws.send(JSON.stringify({
      type: 'connected',
      userId: userId
    }));
  });
  
  console.log('WebSocket server for chat initialized on path: /ws/chat');
  
  return wss;
}

export default router;