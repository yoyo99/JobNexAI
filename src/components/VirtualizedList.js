import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useEffect, useState, memo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { LoadingSpinner } from './LoadingSpinner';
export function VirtualizedList({ items, height, itemHeight, renderItem, onEndReached, endReachedThreshold = 0.8, loadingMore = false, }) {
    const parentRef = useRef(null);
    const [isNearEnd, setIsNearEnd] = useState(false);
    const rowVirtualizer = useVirtualizer({
        count: items.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => itemHeight,
        overscan: 5,
    });
    useEffect(() => {
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
    useEffect(() => {
        setIsNearEnd(false);
    }, [items.length]);
    const MemoizedItem = memo(({ index }) => {
        return renderItem(items[index], index);
    });
    return (_jsxs("div", { ref: parentRef, style: {
            height,
            overflow: 'auto',
            position: 'relative',
            willChange: 'transform',
        }, className: "scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent", children: [_jsx("div", { style: {
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: '100%',
                    position: 'relative',
                }, children: rowVirtualizer.getVirtualItems().map((virtualRow) => (_jsx("div", { style: {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: `${itemHeight}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                    }, children: _jsx(MemoizedItem, { index: virtualRow.index }) }, virtualRow.index))) }), loadingMore && (_jsx("div", { className: "py-4 flex justify-center", children: _jsx(LoadingSpinner, { size: "md", text: "Chargement..." }) }))] }));
}
