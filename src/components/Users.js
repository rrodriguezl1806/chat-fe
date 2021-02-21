import React, {useEffect, useState} from 'react';
import {Col, Image} from "react-bootstrap";
import {gql, useQuery} from "@apollo/client";
import {useMessageDispatch, useMessageState} from "../context/message";
import UserIcon from '../assets/icons/blank-profile-picture.png'

const GET_USERS = gql `
    query getUsers {
        getUsers {
            username,
            createdAt,
            imageUrl,
            latestMessage {
                uuid from to content createdAt
            }
        }
    }
`

const Users = () => {
    const dispatch = useMessageDispatch()
    const { users } = useMessageState()
    const selectedUser = users?.find(u => u.selected === true)

    const { loading } = useQuery(GET_USERS, {
        onCompleted: data => (
            dispatch({
                type: 'SET_USERS',
                payload: data.getUsers
            })
        ),
        onError: error => console.log(error)
    })

    const handleSelectedUser = (user) =>  {
        dispatch({
            type: 'SET_SELECTED_USER',
            payload: user.username
        })
    }

    const renderUsers = () => {
        return (
            <>
                {
                    users.map((user, index) => {
                        const selected = selectedUser === user.username
                        return (
                            <div className={"d-flex p-3 user-div " + (selected ? "selected": "")} key={index} role="button" onClick={() => handleSelectedUser(user)}>
                                <Image
                                    src={user.imageUrl || UserIcon}
                                    roundedCircle
                                    className="mr-2"
                                    style={{ width: 50, height: 50, objectFit: "cover"}}
                                />
                                <div>
                                    <p className="text-success m-0">{user.username}</p>
                                    <p className="font-weight-light m-0">
                                        {user.latestMessage ? user.latestMessage.content : ''}
                                    </p>
                                </div>
                            </div>
                        )
                    })
                }
            </>
        )
    }

    return (
        <Col xs={4} className="p-0" style={{ backgroundColor: '#f5f5f5'}}>
            { users && renderUsers() }
        </Col>
    );
};

export default Users;
