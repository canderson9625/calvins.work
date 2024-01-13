import React from "react";

export default function Notification(props: { message: string }) {

    return (<>
        <p role="alert">{ props.message }</p>
    </>);
}