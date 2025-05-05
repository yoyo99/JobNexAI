var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton, WhatsappShareButton, EmailShareButton, FacebookIcon, TwitterIcon, LinkedinIcon, WhatsappIcon, EmailIcon, } from 'react-share';
export function ShareModal({ isOpen, onClose, job }) {
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
    return (_jsxs(Dialog, { open: isOpen, onClose: onClose, className: "relative z-50", children: [_jsx("div", { className: "fixed inset-0 bg-black/75", "aria-hidden": "true" }), _jsx("div", { className: "fixed inset-0 flex items-center justify-center p-4", children: _jsxs(Dialog.Panel, { className: "w-full max-w-md rounded-lg bg-background p-6 shadow-xl", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx(Dialog.Title, { className: "text-lg font-medium text-white", children: "Partager cette offre" }), _jsx("button", { onClick: onClose, className: "text-gray-400 hover:text-white transition-colors", children: _jsx(XMarkIcon, { className: "h-6 w-6" }) })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-center gap-4", children: [_jsx(FacebookShareButton, { url: shareUrl, hashtag: "#emploi", children: _jsx(FacebookIcon, { size: 40, round: true }) }), _jsx(TwitterShareButton, { url: shareUrl, title: title, children: _jsx(TwitterIcon, { size: 40, round: true }) }), _jsx(LinkedinShareButton, { url: shareUrl, title: title, summary: description, children: _jsx(LinkedinIcon, { size: 40, round: true }) }), _jsx(WhatsappShareButton, { url: shareUrl, title: title, children: _jsx(WhatsappIcon, { size: 40, round: true }) }), _jsx(EmailShareButton, { url: shareUrl, subject: title, body: description, children: _jsx(EmailIcon, { size: 40, round: true }) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-400 mb-2", children: "Ou copier le lien" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", value: shareUrl, readOnly: true, className: "flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" }), _jsx("button", { onClick: handleCopyLink, className: "btn-primary whitespace-nowrap", children: "Copier" })] })] })] })] }) })] }));
}
