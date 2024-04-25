import React, { useEffect, useRef } from "react";

interface InfiniteScrollProps<T> {
    renderItem: (item: T) => React.ReactNode;
    onBottomScroll: () => void;
    items: T[];
    height?: string;
    style?: React.CSSProperties;
    isLoading?: boolean;
    noMoreData?: boolean;
    containerRef?: React.RefObject<HTMLElement>;
    threshold?: number;
    loadingComponent?: React.ReactNode;
    noMoreDataComponent?: React.ReactNode;
}

const InfiniteScroll = <T,>({
    renderItem,
    onBottomScroll,
    items,
    style,
    height,
    isLoading,
    noMoreData,
    containerRef,
    threshold = 1,
    loadingComponent,
    noMoreDataComponent,
}: InfiniteScrollProps<T>) => {
    const defaultContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const containerElem = containerRef ? containerRef.current : defaultContainerRef.current;
        if (!containerElem) return;

        const onScroll = () => {
            if (isBottom(containerElem, threshold)) {
                onBottomScroll();
            }
        };

        containerElem.addEventListener("scroll", onScroll);

        return () => {
            containerElem.removeEventListener("scroll", onScroll);
        };
    }, [containerRef, defaultContainerRef, onBottomScroll, threshold]);

    const loadingComp = loadingComponent || <DefaultLoading />;

    const scrollStyle: React.CSSProperties = !containerRef
        ? {
              height: height || "calc(100%-0px)",
              overflow: "scroll",
              position: "relative",
              ...style,
          }
        : {};

    return (
        <div className="apsara-infinite-scroll-wrapper" style={scrollStyle} ref={defaultContainerRef}>
            {items?.map(renderItem)}
            {isLoading && loadingComp}
            {!noMoreData && noMoreDataComponent}
        </div>
    );
};

const DefaultLoading = () => <div>Loading...</div>;

const isBottom = (elem: HTMLElement, threshold: number): boolean => {
    if (!elem) return false;

    const { scrollTop, scrollHeight, clientHeight } = elem;

    const a = scrollTop + clientHeight;
    const b = scrollHeight - threshold;

    return a >= b;
};

export default InfiniteScroll;
