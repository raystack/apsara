import React, { useCallback, useEffect, useState } from "react";
import InfiniteScroll from "./InfiniteScroll";
import styled from "styled-components";

export default {
    title: "Data Display/InfiniteScroll",
    component: InfiniteScroll,
};

interface User {
    key: number;
    name: string;
    status: "active" | "inactive";
    age: number;
    address: string;
}

function getData(page = 1, page_size = 10): User[] {
    return new Array(page * page_size).fill(0).map((_, index) => {
        return {
            key: index,
            name: `name ${index}`,
            status: index % 2 ? "active" : "inactive",
            age: index,
            address: `A${index} Downing Street`,
        };
    });
}

function getDataAsync(page = 1, page_size = 10): Promise<User[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(getData(page, page_size));
        }, 1000);
    });
}

export const basic = () => {
    const [data, setData] = useState<User[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(false);

    const fetchData = useCallback(() => {
        setIsFetching(true);
        getDataAsync()
            .then((d) => setData((curr) => curr.concat(d)))
            .finally(() => setIsFetching(false));
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const onScroll = () => {
        if (isFetching) return;

        fetchData();
    };

    return (
        <div style={{ height: "80vh" }}>
            <InfiniteScroll<User>
                items={data}
                renderItem={(item) => <Card user={item} />}
                onBottomScroll={onScroll}
                isLoading={isFetching}
            />
        </div>
    );
};

const Card = ({ user }: { user: User }) => {
    return (
        <UserCard>
            <div className="title">{user.name}</div>
            <div className="body">
                <div className="body-left">
                    <div className="description">Address</div>
                    <div>{user.address}</div>
                </div>
                <div className="body-right">
                    <div className="description">Age</div>
                    <div>{user.age}</div>
                </div>
            </div>
        </UserCard>
    );
};

const UserCard = styled.div`
    margin-bottom: 16px;
    border-radius: 2px;
    box-shadow: rgb(179 179 179 / 31%) 0px 1px 5px;

    .title {
        margin: 10px;
        color: #4d85f4;
        font-size: 16px;
    }

    .description {
        margin-top: 20px;
        word-break: break-all;
    }

    .body {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 0px 20px 12px 20px;

        > .body-left {
            margin-top: 16px;
            flex: 1;
        }

        > .body-right {
            width: 240px;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            justify-content: space-between;

            > div {
                display: flex;
                align-items: flex-end;
                flex-direction: column;
            }

            .tag_content {
                text-transform: uppercase;
            }
        }
    }
`;
