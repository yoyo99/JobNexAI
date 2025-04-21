import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment, useEffect, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import Player from '@vimeo/player';
export function VideoModal({ isOpen, onClose }) {
    const { t } = useTranslation();
    const playerRef = useRef(null);
    useEffect(() => {
        if (isOpen && !playerRef.current) {
            playerRef.current = new Player('vimeo-player', {
                id: 123456789, // Replace with your Vimeo video ID
                width: 800,
                loop: false,
                autoplay: true,
            });
            playerRef.current.on('ended', () => {
                onClose();
            });
        }
        return () => {
            if (playerRef.current) {
                playerRef.current.destroy();
                playerRef.current = null;
            }
        };
    }, [isOpen, onClose]);
    return (_jsx(Transition, { appear: true, show: isOpen, as: Fragment, children: _jsxs(Dialog, { as: "div", className: "relative z-50", onClose: onClose, children: [_jsx(Transition.Child, { as: Fragment, enter: "ease-out duration-300", enterFrom: "opacity-0", enterTo: "opacity-100", leave: "ease-in duration-200", leaveFrom: "opacity-100", leaveTo: "opacity-0", children: _jsx("div", { className: "fixed inset-0 bg-black/75" }) }), _jsx("div", { className: "fixed inset-0 overflow-y-auto", children: _jsx("div", { className: "flex min-h-full items-center justify-center p-4", children: _jsx(Transition.Child, { as: Fragment, enter: "ease-out duration-300", enterFrom: "opacity-0 scale-95", enterTo: "opacity-100 scale-100", leave: "ease-in duration-200", leaveFrom: "opacity-100 scale-100", leaveTo: "opacity-0 scale-95", children: _jsxs(Dialog.Panel, { className: "relative w-full max-w-4xl overflow-hidden rounded-lg bg-background shadow-xl", children: [_jsx("button", { onClick: onClose, className: "absolute top-4 right-4 z-10 text-gray-400 hover:text-white", children: _jsx(XMarkIcon, { className: "h-6 w-6" }) }), _jsx("div", { className: "aspect-video", children: _jsx("div", { id: "vimeo-player", className: "w-full h-full" }) }), _jsxs("div", { className: "p-6", children: [_jsx(Dialog.Title, { as: "h3", className: "text-lg font-medium text-white", children: t('hero.watchDemo') }), _jsx("p", { className: "mt-2 text-sm text-gray-400", children: t('demo.description') })] })] }) }) }) })] }) }));
}
