import React from "react";

import DiffTimeline from "./DiffTimeline";

export default {
    title: "General/DiffTimeline",
    component: DiffTimeline,
};

const dataArr = [
    {
        "_id": "3",
        "diff": {
            "updated": [
                "2022-06-21T07:56:31.370Z",
                "2022-08-09T03:11:12.129Z"
            ],
            "deployment_id": [
                "test_id"
            ]
        },
        "user": "test user",
        "reason": "Apsara Component Migration",
        "version": 2,
        "createdAt": "2022-08-09T03:11:12.811Z",
        "updatedAt": "2022-08-09T03:11:12.811Z",
        "__v": 0
    },
    {
        "_id": "2",
        "diff": {
            "updated": [
                "2022-06-21T07:56:31.370Z",
                "2022-08-09T03:11:12.129Z"
            ],
            "deployment_id": [
                "test_id"
            ]
        },
        "user": "test user",
        "reason": "Apsara Component Migration",
        "version": 2,
        "createdAt": "2022-08-09T03:11:12.811Z",
        "updatedAt": "2022-08-09T03:11:12.811Z",
        "__v": 0
    },
    {
        "_id": "1",
        "diff": {
            "updated": [
                "2022-06-21T07:56:31.370Z",
                "2022-08-09T03:11:12.129Z"
            ],
            "deployment_id": [
                "test_id"
            ]
        },
        "user": "test user",
        "reason": "Apsara Component Migration",
        "version": 2,
        "createdAt": "2022-08-09T03:11:12.811Z",
        "updatedAt": "2022-08-09T03:11:12.811Z",
        "__v": 0
    }
]

export const DiffTimeLine = () => {
    return (
        <>
            <DiffTimeline data={dataArr} />
        </>
    );
};
