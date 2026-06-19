import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import { Send, Search, User, MoreVertical, Phone, Video, Smile, Paperclip, MessageSquare } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Messages = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef();

    useEffect(() => {
        fetchMessages();
    }, []);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchMessages = async () => {
        if (!user) return;
        try {
            const response = await axios.get('/messages');
            // Groupe par interlocuteur pour simuler des conversations
            const grouped = response.data.reduce((acc, msg) => {
                const other = msg.sender_id === user.id ? msg.receiver : msg.sender;
                if (!acc[other.id]) {
                    acc[other.id] = {
                        user: other,
                        lastMessage: msg,
                        messages: []
                    };
                }
                acc[other.id].messages.push(msg);
                return acc;
            }, {});
            const convList = Object.values(grouped);
            
            const targetUser = location.state?.targetUser;
            if (targetUser) {
                const existingConv = convList.find(c => c.user.id === targetUser.id);
                if (existingConv) {
                    setConversations(convList);
                    if (!activeChat || activeChat.user.id !== targetUser.id) {
                        setActiveChat(existingConv);
                        setMessages(existingConv.messages.slice().reverse());
                    }
                } else {
                    const newConv = {
                        user: targetUser,
                        lastMessage: { content: 'Nouvelle conversation...' },
                        messages: []
                    };
                    setConversations([newConv, ...convList]);
                    if (!activeChat || activeChat.user.id !== targetUser.id) {
                        setActiveChat(newConv);
                        setMessages([]);
                    }
                }
            } else {
                setConversations(convList);
                if (convList.length > 0 && !activeChat) {
                    setActiveChat(convList[0]);
                    setMessages(convList[0].messages.slice().reverse());
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChat) return;

        try {
            const response = await axios.post('/messages', {
                receiver_id: activeChat.user.id,
                content: newMessage
            });
            setMessages([...messages, response.data]);
            setNewMessage('');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-120px)] flex gap-6">
            {/* Sidebar */}
            <div className="w-full md:w-80 flex flex-col gap-4">
                <div className="card p-4 flex flex-col h-full overflow-hidden border-none shadow-xl shadow-gray-200/50">
                    <h2 className="text-xl font-black text-gray-900 mb-4 tracking-tight px-2">Discussions</h2>
                    
                    <div className="relative mb-6">
                        <input className="input pl-10 bg-gray-50 border-none focus:ring-agri-green/20" placeholder="Rechercher..." />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                        {conversations.map((conv) => (
                            <button 
                                key={conv.user.id}
                                onClick={() => {
                                    setActiveChat(conv);
                                    setMessages(conv.messages.slice().reverse());
                                }}
                                className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all ${activeChat?.user.id === conv.user.id ? 'bg-agri-green/10 border-agri-green/20 shadow-sm' : 'hover:bg-gray-50 border-transparent'}`}
                            >
                                <div className="w-12 h-12 rounded-full bg-agri-green/10 flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-white shadow-sm">
                                    {conv.user.photo ? <img src={conv.user.photo} className="w-full h-full object-cover" /> : <User className="w-6 h-6 text-agri-green" />}
                                </div>
                                <div className="text-left overflow-hidden">
                                    <p className="font-bold text-gray-900 truncate">{conv.user.name}</p>
                                    <p className="text-xs text-gray-500 truncate font-medium">{conv.lastMessage.content}</p>
                                </div>
                                {conv.messages.some(m => !m.is_read && m.receiver_id === user.id) && (
                                    <div className="ml-auto w-2 h-2 bg-agri-red rounded-full"></div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {activeChat ? (
                    <div className="card p-0 flex flex-col h-full overflow-hidden border-none shadow-xl shadow-gray-200/50">
                        {/* Header */}
                        <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-white/50 backdrop-blur">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-agri-green/10 flex items-center justify-center overflow-hidden border border-gray-100">
                                    {activeChat.user.photo ? <img src={activeChat.user.photo} className="w-full h-full object-cover" /> : <User className="w-5 h-5 text-agri-green" />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 leading-tight">{activeChat.user.name}</h3>
                                    <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">En ligne</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-gray-400">
                                <button className="p-2 hover:bg-gray-50 rounded-full transition-colors"><Phone className="w-5 h-5" /></button>
                                <button className="p-2 hover:bg-gray-50 rounded-full transition-colors"><Video className="w-5 h-5" /></button>
                                <button className="p-2 hover:bg-gray-50 rounded-full transition-colors"><MoreVertical className="w-5 h-5" /></button>
                            </div>
                        </div>

                        {/* Messages List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50 custom-scrollbar">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] p-4 rounded-2xl shadow-sm ${msg.sender_id === user.id ? 'bg-agri-green text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'}`}>
                                        <p className="text-sm font-medium">{msg.content}</p>
                                        <p className={`text-[10px] mt-2 opacity-70 font-bold ${msg.sender_id === user.id ? 'text-right' : 'text-left'}`}>
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div ref={scrollRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-white border-t border-gray-50">
                            <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                                <div className="flex gap-1 text-gray-400">
                                    <button type="button" className="p-2 hover:bg-gray-50 rounded-full transition-colors"><Paperclip className="w-5 h-5" /></button>
                                    <button type="button" className="p-2 hover:bg-gray-50 rounded-full transition-colors"><Smile className="w-5 h-5" /></button>
                                </div>
                                <input 
                                    className="input bg-gray-50 border-none flex-1 py-3 focus:ring-agri-green/20" 
                                    placeholder="Écrivez votre message..." 
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button type="submit" className="bg-agri-green text-white p-3 rounded-xl hover:bg-emerald-600 shadow-lg shadow-agri-green/20 transition-all active:scale-95">
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="card flex-1 flex flex-col items-center justify-center text-center p-12 bg-gray-50/50 border-none shadow-none">
                        <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6">
                            <MessageSquare className="w-10 h-10 text-gray-200" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">Sélectionnez une discussion</h3>
                        <p className="text-gray-500 max-w-sm">Choisissez un interlocuteur pour commencer à échanger en direct sur vos produits.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;
