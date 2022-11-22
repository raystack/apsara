import { useEffect, useRef } from "react";
import useForceUpdate from "../../hooks/useForceUpdate";
import type { ScreenMap } from "../../utils/responsiveObserve";
import ResponsiveObserve from "../../utils/responsiveObserve";

function useBreakpoint(refreshOnChange = true): ScreenMap {
    const screensRef = useRef<ScreenMap>({});
    const forceUpdate = useForceUpdate();

    useEffect(() => {
        const token = ResponsiveObserve.subscribe((supportScreens) => {
            screensRef.current = supportScreens;
            if (refreshOnChange) {
                forceUpdate();
            }
        });

        return () => ResponsiveObserve.unsubscribe(token);
    }, []);

    return screensRef.current;
}

export default useBreakpoint;
