import React, {useState} from 'react';
import {Button, Col, Form, Row} from "react-bootstrap";
import {gql, useLazyQuery, useMutation, useQuery} from '@apollo/client';
import { useAuthDispatch } from "../context/auth";

const LOGIN_USER = gql`
    query login($username: String! $password: String!) {
        login(username: $username, password: $password) {
            token
            username
            createdAt
            email
        }
    }
`;

const Login = (props) => {
    const [variables, setVariables] = useState({
        username: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const dispatch = useAuthDispatch()
    const [loginUser, { loading }] = useLazyQuery(LOGIN_USER, {
        onCompleted(data) {
            dispatch({ type: 'LOGIN', payload: data.login })
            window.location.href = '/'
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.errors)
        }
    });

    const handleChange = e => {
        const { name, value } = e.target
        setVariables({
            ...variables,
            [name]: value
        })
    }

    const submitLoginForm = e => {
        e.preventDefault()
        loginUser({variables});
    }

    return (
        <Row className="bg-white py-5 justify-content-center">
            <Col sm={8} md={6} lg={4}>
                <h1 className="text-center">Login</h1>
                <Form onSubmit={submitLoginForm}>
                    <Form.Group controlId="username">
                        <Form.Label className={errors.username && 'text-danger'}>Username</Form.Label>
                        <Form.Control
                            type="text"
                            name="username"
                            value={variables.username}
                            onChange={handleChange}
                            placeholder="Enter Username"
                            isInvalid={!!errors.username}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.username}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="password">
                        <Form.Label className={errors.password && 'text-danger'}>Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            value={variables.password}
                            onChange={handleChange}
                            placeholder="Password"
                            isInvalid={!!errors.password}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.password}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <div className="text-center">
                        <Button variant="success" type="submit" disabled={loading}>
                            { loading ? 'Loading ...' : 'Login' }
                        </Button>
                    </div>
                </Form>
            </Col>
        </Row>
    );
};

export default Login;
