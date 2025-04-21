"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoModal = VideoModal;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_2 = require("@headlessui/react");
const outline_1 = require("@heroicons/react/24/outline");
const react_i18next_1 = require("react-i18next");
const player_1 = __importDefault(require("@vimeo/player"));
function VideoModal({ isOpen, onClose }) {
    const { t } = (0, react_i18next_1.useTranslation)();
    const playerRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (isOpen && !playerRef.current) {
            playerRef.current = new player_1.default('vimeo-player', {
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
    return ((0, jsx_runtime_1.jsx)(react_2.Transition, { appear: true, show: isOpen, as: react_1.Fragment, children: (0, jsx_runtime_1.jsxs)(react_2.Dialog, { as: "div", className: "relative z-50", onClose: onClose, children: [(0, jsx_runtime_1.jsx)(react_2.Transition.Child, { as: react_1.Fragment, enter: "ease-out duration-300", enterFrom: "opacity-0", enterTo: "opacity-100", leave: "ease-in duration-200", leaveFrom: "opacity-100", leaveTo: "opacity-0", children: (0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black/75" }) }), (0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 overflow-y-auto", children: (0, jsx_runtime_1.jsx)("div", { className: "flex min-h-full items-center justify-center p-4", children: (0, jsx_runtime_1.jsx)(react_2.Transition.Child, { as: react_1.Fragment, enter: "ease-out duration-300", enterFrom: "opacity-0 scale-95", enterTo: "opacity-100 scale-100", leave: "ease-in duration-200", leaveFrom: "opacity-100 scale-100", leaveTo: "opacity-0 scale-95", children: (0, jsx_runtime_1.jsxs)(react_2.Dialog.Panel, { className: "relative w-full max-w-4xl overflow-hidden rounded-lg bg-background shadow-xl", children: [(0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "absolute top-4 right-4 z-10 text-gray-400 hover:text-white", children: (0, jsx_runtime_1.jsx)(outline_1.XMarkIcon, { className: "h-6 w-6" }) }), (0, jsx_runtime_1.jsx)("div", { className: "aspect-video", children: (0, jsx_runtime_1.jsx)("div", { id: "vimeo-player", className: "w-full h-full" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsx)(react_2.Dialog.Title, { as: "h3", className: "text-lg font-medium text-white", children: t('hero.watchDemo') }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-sm text-gray-400", children: t('demo.description') })] })] }) }) }) })] }) }));
}
