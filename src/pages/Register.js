import React, {useState} from 'react';
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import { gql, useMutation } from '@apollo/client';

const REGISTER_USER = gql`
    mutation register($username: String! $email: String! $password: String! $confirmPassword: String!) {
        register(username: $username, email: $email, password: $password, confirmPassword: $confirmPassword) {
            username
            email
            createdAt
        }
    }
`;

const Register = (props) => {
    const [variables, setVariables] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [registerUser, { loading }] = useMutation(REGISTER_USER, {
        update(_, __) {
            props.history.push('/login')
        },
        onError(err) {
            console.log(err.graphQLErrors[0].extensions.errors)
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

    const submitRegisterForm = e => {
        e.preventDefault()
        registerUser({variables});
    }

    return (
        <Row className="bg-white py-5 justify-content-center">
            <Col sm={8} md={6} lg={4}>
                <h1 className="text-center">Register</h1>
                <Form onSubmit={submitRegisterForm}>
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

                    <Form.Group controlId="email">
                        <Form.Label className={errors.email && 'text-danger'}>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={variables.email}
                            onChange={handleChange}
                            placeholder="Enter email"
                            isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.email}
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

                    <Form.Group controlId="confirmPassword">
                        <Form.Label className={errors.confirmPassword && 'text-danger'}>Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="confirmPassword"
                            value={variables.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm Password"
                            isInvalid={!!errors.confirmPassword}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.confirmPassword}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <div className="text-center">
                        <Button variant="success" type="submit" disabled={loading}>
                            { loading ? 'Loading ...' : 'Register' }
                        </Button>
                    </div>
                </Form>
            </Col>
        </Row>
    );
};

export default Register;
