"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VirtualizedList = VirtualizedList;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_virtual_1 = require("@tanstack/react-virtual");
const LoadingSpinner_1 = require("./LoadingSpinner");
function VirtualizedList({ items, height, itemHeight, renderItem, onEndReached, endReachedThreshold = 0.8, loadingMore = false, }) {
    const parentRef = (0, react_1.useRef)(null);
    const [isNearEnd, setIsNearEnd] = (0, react_1.useState)(false);
    const rowVirtualizer = (0, react_virtual_1.useVirtualizer)({
        count: items.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => itemHeight,
        overscan: 5,
    });
    (0, react_1.useEffect)(() => {
        if (!onEndReached || !parentRef.current || isNearEnd || loadingMore)
            return;
        const handleScroll = () => {
            if (!parentRef.current)
                return;
            const { scrollTop, scrollHeight, clientHeight } = parentRef.current;
            const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
            if (scrollPercentage > endReachedThreshold) {
                setIsNearEnd(true);
                onEndReached();
            }
        };
        const element = parentRef.current;
        element.addEventListener('scroll', handleScroll, { passive: true });
        return () => element.removeEventListener('scroll', handleScroll);
    }, [onEndReached, isNearEnd, endReachedThreshold, loadingMore]);
    // Reset isNearEnd when items change
    (0, react_1.useEffect)(() => {
        setIsNearEnd(false);
    }, [items.length]);
    const MemoizedItem = (0, react_1.memo)(({ index }) => {
        return renderItem(items[index], index);
    });
    return ((0, jsx_runtime_1.jsxs)("div", { ref: parentRef, style: {
            height,
            overflow: 'auto',
            position: 'relative',
            willChange: 'transform',
        }, className: "scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent", children: [(0, jsx_runtime_1.jsx)("div", { style: {
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: '100%',
                    position: 'relative',
                }, children: rowVirtualizer.getVirtualItems().map((virtualRow) => ((0, jsx_runtime_1.jsx)("div", { style: {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: `${itemHeight}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                    }, children: (0, jsx_runtime_1.jsx)(MemoizedItem, { index: virtualRow.index }) }, virtualRow.index))) }), loadingMore && ((0, jsx_runtime_1.jsx)("div", { className: "py-4 flex justify-center", children: (0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, { size: "md", text: "Chargement..." }) }))] }));
}
