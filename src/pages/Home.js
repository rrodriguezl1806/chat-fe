import React, {useEffect, useState} from 'react';
import {Row, Button} from "react-bootstrap";
import {Link} from "react-router-dom";
import {useAuthDispatch, useAuthState} from "../context/auth";
import { useMessageDispatch } from "../context/message";
import Users from "../components/Users";
import Messages from "../components/Messages";
import {gql, useSubscription} from "@apollo/client"

const NEW_MESSAGE = gql `
    subscription newMessage {
        newMessage {
            uuid
            from
            to
            content
            createdAt
        }
    }
`

const NEW_REACTION = gql `
    subscription newReaction {
        newReaction {
            uuid
            content
            message {
                uuid
                from
                to
            }
        }
    }
`

const Home = (props) => {
    const authDispatch = useAuthDispatch()
    const messageDispatch = useMessageDispatch()
    const { user } = useAuthState()

    const { data: messageData, error: messageError , loading } = useSubscription(NEW_MESSAGE);
    const { data: reactionData, error: reactionError } = useSubscription(NEW_REACTION);

    useEffect(() => {
        if (messageError) console.log(messageError)

        if (messageData) {
            const message = messageData.newMessage
            const otherUser = user.username === message.to ? message.from : message.to
            messageDispatch({
                type: 'ADD_MESSAGE',
                payload: {
                    username: otherUser,
                    message
                }
            })
        }
    }, [messageError, messageData]);

    useEffect(() => {
        if (reactionError) console.log(reactionError)

        if (reactionData) {
            const reaction = reactionData.newReaction
            const otherUser = user.username === reaction.message.to ? reaction.message.from : reaction.message.to
            messageDispatch({
                type: 'ADD_REACTION',
                payload: {
                    username: otherUser,
                    reaction
                }
            })
        }
    }, [reactionError, reactionData]);


    const logout = () => {
        authDispatch({ type: 'LOGOUT' })
        window.location.href = '/login'
    }

    return (
        <>
            <Row className="bg-white justify-content-around mb-1">
                <Link to="/login">
                    <Button variant={"link"}>Login</Button>
                </Link>
                <Link to="/register">
                    <Button variant={"link"}>Register</Button>
                </Link>
                <Button variant={"link"} onClick={logout}>Logout</Button>
            </Row>
            <Row className="bg-white">
                <Users />
                <Messages />
            </Row>
        </>
    );
};

export default Home;
