import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import Message from './models/Message.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // For development
        methods: ['GET', 'POST']
    }
});

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/users', userRoutes);
app.use('/api/stats', statsRoutes);

// Socket.io logic overview
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Broadcast when a user joins
    socket.on('join', (username) => {
        io.emit('message', {
            _id: Date.now(),
            sender: { username: 'System' },
            message: `${username} has joined the chat`,
            createdAt: new Date()
        });
    });

    // Listen for chat message
    socket.on('chatMessage', async (data) => {
        try {
            // Save message to DB
            const newMessage = await Message.create({
                sender: data.senderId,
                message: data.message
            });
            // Populate sender info before emitting
            const populatedMessage = await newMessage.populate('sender', 'username');
            
            io.emit('message', populatedMessage);
        } catch (error) {
            console.error('Error saving message:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});


    const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});




