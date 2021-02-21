import React, {useEffect, useState} from 'react';
import {Col, Form, Image} from "react-bootstrap";
import {gql, useLazyQuery, useMutation} from "@apollo/client";
import {useMessageDispatch, useMessageState} from "../context/message";
import Message from "./Message";
import SendIcon from '../assets/icons/send.svg';

const SEND_MESSAGE = gql `
    mutation sendMessage ($to: String!, $content: String!) {
        sendMessage (to: $to, content: $content) {
            uuid from to content createdAt
        }
    }
`

const GET_MESSAGES = gql `
    query getMessages ($from: String!) {
        getMessages (from: $from) {
            uuid
            from
            to
            content
            createdAt
            reactions {
                uuid
                content
            }
        }
    }
`

const Messages = () => {
    const dispatch = useMessageDispatch()
    const [getMessages, { loading: messageLoading, data: messagesData }] = useLazyQuery(GET_MESSAGES)
    const { users } = useMessageState()
    const [content, setContent] = useState('');

    const selectedUser = users?.find(u => u.selected === true)
    const messages = selectedUser?.messages

    const [sendMessage] = useMutation(SEND_MESSAGE, {
        // onCompleted: data => dispatch({ type: 'ADD_MESSAGE', payload: {
        //     username: selectedUser.username,
        //     message: data.sendMessage
        // }})
    })

    useEffect(() => {
        if (selectedUser) {
            getMessages({ variables: { from: selectedUser.username }})
        }
    }, [selectedUser]);

    useEffect(() => {
        if (messagesData) {
            dispatch({
                type: 'SET_USER_MESSAGE',
                payload: {
                    username: selectedUser.username,
                    messages: messagesData.getMessages
                }
            })
        }
    }, [messagesData]);


    const submitMessage = (e) => {
        e.preventDefault()
        if (content === '' || !selectedUser) return

        sendMessage({ variables: { to: selectedUser.username, content} })
        setContent('')
    }

    const renderMessages = () => {
        return (
            <>
                {messages.map((message, index) => {
                    return (
                        <Message key={index} message={message}/>
                    )
                })}
            </>
        )
    }

    return (
        <Col xs={10} md={8}>
            <div className="message-box d-flex flex-column-reverse p-3">
                {messages && messages.length > 0 ? renderMessages(): ""}
            </div>
            <div>
                <Form onSubmit={submitMessage}>
                    <Form.Group className="d-flex align-items-center">
                        <Form.Control
                            type="text"
                            className={"message-input rounded-pill bg-secondary px-3 border-0"}
                            placeholder={"Type a message ..."}
                            value={content}
                            onChange={e => setContent(e.target.value)}
                        />
                        <img
                            src={SendIcon} alt="send"
                            style={{ width: 30}}
                            className="ml-2 text-primary"
                            onClick={submitMessage}
                            role="button"
                        />
                    </Form.Group>
                </Form>
            </div>
        </Col>
    );
};

export default Messages;
