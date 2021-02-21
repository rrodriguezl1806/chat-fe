import React, {useState} from 'react';
import {useAuthState} from "../context/auth";
import { Button, OverlayTrigger, Popover, Tooltip } from "react-bootstrap";
import SmileIcon from '../assets/icons/smile.svg';
import {gql, useMutation} from "@apollo/client";

const REACT_TO_MESSAGE = gql `
    mutation reactToMessage ($uuid: String! $content: String!) {
        reactToMessage(uuid: $uuid content: $content) {
            uuid
        }
    }
`

const Message = ({ message }) => {
    const { user } = useAuthState()
    const sent = message.from === user.username
    const [showPopover, setShowPopover] = useState(false);
    const reactions = ['❤️', '😆', '😯', '😢', '😡', '👍', '👎']

    const [reactToMessage] = useMutation(REACT_TO_MESSAGE, {
        onError: error => console.log(error),
        onCompleted: data => {
            console.log(data.reactToMessage)
            setShowPopover(false)
        }
    })

    const react = (reaction) => {
        reactToMessage({ variables: {uuid: message.uuid, content: reaction} })
    }

    const reactionIcons = [...new Set(message.reactions.map(r => r.content))]

    const reactButton = (
        <OverlayTrigger
            trigger="click"
            placement="top"
            show={showPopover}
            onToggle={setShowPopover}
            transition={false}
            rootClose
            overlay={
                <Popover className="rounded-pill" id="sd">
                    <Popover.Content className="d-flex align-items-center react-button-popover">
                        {reactions.map(reaction => (
                            <Button
                                variant={"link"}
                                className="react-icon-button"
                                key={reaction}
                                onClick={() => react(reaction)}
                            >
                                {reaction}
                            </Button>
                        ))}
                    </Popover.Content>
                </Popover>
            }
        >
            <Button variant={"link"} className="px-2">
                <img src={SmileIcon} alt=""  style={{ width: 15}}/>
            </Button>
        </OverlayTrigger>
)

    return (
        <div className={"d-flex my-3 " + (sent ? "ml-auto": "mr-auto")}>
            {sent && reactButton}
            <div className={"py-2 px-3 rounded-pill position-relative " + (sent ? "bg-primary": "bg-secondary")}>
                {message.reactions.length > 0 && (
                    <div className="reaction-div bg-secondary p-1 rounded-pill">
                        {reactionIcons} {message.reactions.length}
                    </div>
                )}
                <p className={"m-0 " + (sent ? "text-white": "text-black")}>{message.content}</p>
            </div>
            {!sent && reactButton}
        </div>
    );
};

export default Message;
