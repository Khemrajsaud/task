import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { io } from 'socket.io-client';
import api from '../services/api';

const Chat = () => {
    const { user, logout } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [stats, setStats] = useState({ totalUsers: 0, totalMessages: 0 });
    const [allUsers, setAllUsers] = useState([]);
    const socket = useRef();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        socket.current = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000');
        
        socket.current.emit('join', user.username);
        
        socket.current.on('message', (msg) => {
            setMessages((prev) => [...prev, msg]);
            if (msg.sender && msg.sender.username !== 'System') {
                setStats(prev => ({ ...prev, totalMessages: prev.totalMessages + 1 }));
            }
        });

        fetchStats();
        fetchAllUsers();

        return () => {
            socket.current.disconnect();
        };
    }, [user.username]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchStats = async () => {
        try {
            const { data } = await api.get('/stats');
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchAllUsers = async () => {
        try {
            const { data } = await api.get('/users');
            setAllUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        socket.current.emit('chatMessage', {
            senderId: user._id,
            message: newMessage
        });

        setNewMessage('');
    };

    return (
        <div className="flex h-screen bg-gray-900 overflow-hidden text-gray-100 font-sans">
            {/* Sidebar */}
            <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col hide-scrollbar shadow-lg z-20">
                <div className="p-5 border-b border-gray-700 flex justify-between items-center bg-gray-800">
                    <h2 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent tracking-tight">ChatApp</h2>
                    <button onClick={logout} className="text-xs font-semibold px-4 py-2 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-lg transition-all shadow-sm">Logout</button>
                </div>
                
                {/* Stats */}
                <div className="p-5 border-b border-gray-700 grid grid-cols-2 gap-4 bg-gray-800">
                    <div className="bg-gray-900/50 p-4 rounded-xl text-center border border-gray-700/50 shadow-inner">
                        <div className="text-3xl font-black text-blue-400 tracking-tight">{stats.totalUsers}</div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-1 font-bold">Users</div>
                    </div>
                    <div className="bg-gray-900/50 p-4 rounded-xl text-center border border-gray-700/50 shadow-inner">
                        <div className="text-3xl font-black text-indigo-400 tracking-tight">{stats.totalMessages}</div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-1 font-bold">Messages</div>
                    </div>
                </div>

                {/* Users List */}
                <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                    <div className="flex items-center justify-between mb-4">
                       <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">All Users</h3>
                       <span className="bg-blue-500/20 text-blue-400 text-[10px] px-2 py-0.5 rounded-full font-bold">{allUsers.length}</span>
                    </div>
                    <ul className="space-y-3">
                        {allUsers.map((u) => (
                            <li key={u._id} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-700/40 transition-all cursor-default border border-transparent hover:border-gray-700/60 group">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-sm font-bold shadow-md transform group-hover:scale-105 transition-transform">
                                    {u.username.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex flex-col">
                                    <span className={u.username === user.username ? "font-bold text-blue-400 text-sm" : "text-gray-200 text-sm font-medium group-hover:text-white transition-colors"}>
                                        {u.username} {u.username === user.username && "(You)"}
                                    </span>
                                    <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1.5 mt-0.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span> Online
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-gray-900 relative">
                {/* Chat Header */}
                <div className="h-[72px] px-6 border-b border-gray-800 bg-gray-900/95 backdrop-blur-xl absolute top-0 w-full z-10 flex justify-between items-center">
                    <div>
                        <h2 className="font-bold text-xl text-white tracking-tight">Global Chat</h2>
                        <p className="text-xs font-semibold text-emerald-400/90 flex items-center gap-1.5 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                            Real-time connection active
                        </p>
                    </div>
                    <div className="flex items-center gap-3 bg-gray-800 px-4 py-2 rounded-full border border-gray-700/50">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold shadow-inner">
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-sm text-gray-400 font-medium">
                            <span className="text-gray-100 font-bold">{user.username}</span>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-6 pt-24 pb-32 space-y-6 custom-scrollbar bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800/20 via-gray-900 to-gray-900">
                    {messages.map((msg, index) => {
                        const isSystem = msg.sender?.username === 'System';
                        const isMe = msg.sender?._id === user._id;

                        if (isSystem) {
                            return (
                                <div key={index} className="flex justify-center my-6">
                                    <span className="px-4 py-1.5 bg-gray-800/80 rounded-full text-xs font-medium text-gray-400 border border-gray-700/50 backdrop-blur-sm shadow-sm tracking-wide">
                                        {msg.message}
                                    </span>
                                </div>
                            );
                        }

                        return (
                            <div key={index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                <div className="flex items-baseline gap-2 mb-1.5 px-1">
                                    <span className={`text-[11px] font-bold tracking-wide ${isMe ? 'text-blue-400' : 'text-gray-400 max-w-full'}`}>
                                        {isMe ? 'You' : msg.sender?.username}
                                    </span>
                                </div>
                                <div className={`max-w-[75%] px-5 py-3.5 shadow-md relative group text-[15px] leading-relaxed
                                    ${isMe ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl rounded-tr-sm' : 'bg-gray-800 text-gray-100 border border-gray-700/60 rounded-2xl rounded-tl-sm'}`}>
                                    {msg.message}
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-6 bg-gradient-to-t from-gray-900 via-gray-900 to-transparent absolute bottom-0 w-full">
                    <form onSubmit={handleSendMessage} className="flex space-x-3 max-w-5xl mx-auto items-end bg-gray-800/80 p-2 rounded-2xl border border-gray-700/80 backdrop-blur-lg shadow-xl relative">
                        <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage(e);
                                }
                            }}
                            placeholder="Type your message..."
                            className="flex-1 max-h-32 min-h-[48px] px-4 py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none resize-none hide-scrollbar"
                            rows="1"
                        />
                        <button
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md group h-[48px] w-[48px] flex items-center justify-center shrink-0 mb-0.5 mr-0.5"
                        >
                            <svg className="w-5 h-5 rtl:rotate-180 translate-x-0.5 transform group-hover:translate-x-1 group-disabled:transform-none transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Chat;
