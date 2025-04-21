"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShareModal = ShareModal;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@headlessui/react");
const outline_1 = require("@heroicons/react/24/outline");
const react_share_1 = require("react-share");
function ShareModal({ isOpen, onClose, job }) {
    const shareUrl = job.url;
    const title = `${job.title} chez ${job.company}`;
    const description = `Découvrez cette offre d'emploi : ${job.title} chez ${job.company}`;
    const handleCopyLink = () => __awaiter(this, void 0, void 0, function* () {
        try {
            yield navigator.clipboard.writeText(shareUrl);
            // On pourrait ajouter une notification de succès ici
        }
        catch (error) {
            console.error('Failed to copy link:', error);
        }
    });
    return ((0, jsx_runtime_1.jsxs)(react_1.Dialog, { open: isOpen, onClose: onClose, className: "relative z-50", children: [(0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black/75", "aria-hidden": "true" }), (0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 flex items-center justify-center p-4", children: (0, jsx_runtime_1.jsxs)(react_1.Dialog.Panel, { className: "w-full max-w-md rounded-lg bg-background p-6 shadow-xl", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsx)(react_1.Dialog.Title, { className: "text-lg font-medium text-white", children: "Partager cette offre" }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "text-gray-400 hover:text-white transition-colors", children: (0, jsx_runtime_1.jsx)(outline_1.XMarkIcon, { className: "h-6 w-6" }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-center gap-4", children: [(0, jsx_runtime_1.jsx)(react_share_1.FacebookShareButton, { url: shareUrl, hashtag: "#emploi", children: (0, jsx_runtime_1.jsx)(react_share_1.FacebookIcon, { size: 40, round: true }) }), (0, jsx_runtime_1.jsx)(react_share_1.TwitterShareButton, { url: shareUrl, title: title, children: (0, jsx_runtime_1.jsx)(react_share_1.TwitterIcon, { size: 40, round: true }) }), (0, jsx_runtime_1.jsx)(react_share_1.LinkedinShareButton, { url: shareUrl, title: title, summary: description, children: (0, jsx_runtime_1.jsx)(react_share_1.LinkedinIcon, { size: 40, round: true }) }), (0, jsx_runtime_1.jsx)(react_share_1.WhatsappShareButton, { url: shareUrl, title: title, children: (0, jsx_runtime_1.jsx)(react_share_1.WhatsappIcon, { size: 40, round: true }) }), (0, jsx_runtime_1.jsx)(react_share_1.EmailShareButton, { url: shareUrl, subject: title, body: description, children: (0, jsx_runtime_1.jsx)(react_share_1.EmailIcon, { size: 40, round: true }) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400 mb-2", children: "Ou copier le lien" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", value: shareUrl, readOnly: true, className: "flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" }), (0, jsx_runtime_1.jsx)("button", { onClick: handleCopyLink, className: "btn-primary whitespace-nowrap", children: "Copier" })] })] })] })] }) })] }));
}
