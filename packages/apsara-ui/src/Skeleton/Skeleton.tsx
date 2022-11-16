import React from 'react';
import { StyledSkeleton, ListItem, StyledRow } from './Skeleton.styles';

interface ListSkeletonProps {
    className?: string;
    rows?: number;
    width?: string;
}
export function ListSkeleton({ className = "", rows = 20, width = "100%" }: ListSkeletonProps) {
    return (
        <StyledSkeleton className={className} $props={{ "width": width }}>
            <ul>
                {[...Array(rows)].map(() => <ListItem />)}
            </ul>
        </StyledSkeleton>
    )
}

interface EditorSkeletonProps {
    className?: string;
    width?: string;
    lastLineWidth?: string
}
export function EditorSkeleton({ className = "", width = "100%", lastLineWidth = "100%" }: EditorSkeletonProps) {
    return (
        <StyledSkeleton className={className} $props={{ "width": width, "lastLineWidth": lastLineWidth }} $editor={true}>
            <ul>
                {[...Array(5)].map(() => <ListItem />)}
            </ul>
        </StyledSkeleton>
    )
}

export const DetailsSkeleton = ({ className = "", height = "32px" }) => {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <StyledRow $props={{ "height": height, "maxWidth": 4, "width": 4 }} />
                <StyledRow $props={{ "height": height, "maxWidth": 8, "width": 8 }} />
            </div>
            <StyledRow style={{ marginTop: '30px' }} $props={{ "height": "40px", "maxWidth": 9, "width": 9 }} />
            <StyledSkeleton className={className} style={{ marginTop: '40px' }}>
                <ul style={{ padding: 0 }}>
                    {[...Array(15)].map(() => <ListItem />)}
                </ul>
            </StyledSkeleton>

        </div>
    )
}