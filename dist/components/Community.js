import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
const initialMessages = [
    {
        id: 1,
        author: 'Alice',
        content: 'Bienvenue sur la communauté JobNexus ! Présentez-vous ici.',
        likes: 2,
        replies: [
            { id: 2, author: 'Bob', content: 'Bonjour à tous !', likes: 1, replies: [] },
        ],
    },
];
const Community = () => {
    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState('');
    const handlePost = () => {
        if (!newMessage.trim())
            return;
        setMessages([
            ...messages,
            { id: Date.now(), author: 'Vous', content: newMessage, likes: 0, replies: [] },
        ]);
        setNewMessage('');
    };
    const handleLike = (id) => {
        setMessages(messages.map(msg => msg.id === id ? Object.assign(Object.assign({}, msg), { likes: msg.likes + 1 }) : msg));
    };
    return (_jsxs("div", { className: "prose mx-auto p-8 bg-background text-white rounded-lg max-w-3xl", children: [_jsx("h1", { children: "Communaut\u00E9 JobNexus" }), _jsxs("div", { className: "mb-6", children: [_jsx("textarea", { className: "w-full rounded-lg p-2 text-black", placeholder: "\u00C9crivez un message...", value: newMessage, onChange: e => setNewMessage(e.target.value) }), _jsx("button", { className: "btn-primary mt-2", onClick: handlePost, children: "Poster" })] }), _jsx("ul", { className: "space-y-4", children: messages.map(msg => (_jsxs("li", { className: "bg-white/10 p-4 rounded-lg", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "font-semibold", children: msg.author }), _jsxs("button", { className: "text-primary-400", onClick: () => handleLike(msg.id), children: ["\uD83D\uDC4D ", msg.likes] })] }), _jsx("div", { className: "mt-2", children: msg.content }), msg.replies.length > 0 && (_jsx("ul", { className: "ml-6 mt-2 space-y-2", children: msg.replies.map(reply => (_jsxs("li", { className: "bg-white/5 p-2 rounded", children: [_jsxs("span", { className: "font-semibold", children: [reply.author, ":"] }), " ", reply.content] }, reply.id))) }))] }, msg.id))) })] }));
};
export default Community;
