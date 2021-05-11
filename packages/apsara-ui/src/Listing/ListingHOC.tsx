import React from "react";
import { ListLoader } from "../Loader";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ListingHOCProps {}
export default function ListingHOC<T extends ListingHOCProps = ListingHOCProps>(
    WrappedComponent: React.ComponentType<T>,
) {
    // Try to create a nice displayName for React Dev Tools.
    const displayName = WrappedComponent.displayName || WrappedComponent.name || "Component";

    const ComponentListingHOC = ({ loading = false, ...props }: Omit<T, keyof ListingHOCProps> | any) => {
        if (loading) return <ListLoader />;
        // props comes afterwards so the can override the default ones.
        return <WrappedComponent {...(props as T)} />;
    };

    ComponentListingHOC.displayName = `ListingHOC(${displayName})`;
    return ComponentListingHOC;
}
