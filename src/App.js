import './App.scss'
import {Container} from "react-bootstrap";
import ApolloProvider from "./ApolloProvider";
import { BrowserRouter, Route, Switch } from "react-router-dom"
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthReducer } from "./context/auth"
import { MessageReducer } from "./context/message"

function App() {
    return (
        <ApolloProvider>
            <AuthReducer>
                <MessageReducer>
                    <BrowserRouter>
                        <Container className='pt-5'>
                            <Switch>
                                <Route exact path={'/'} component={Home} />
                                <Route path={'/register'} component={Register} />
                                <Route path={'/login'} component={Login} />
                            </Switch>
                        </Container>
                    </BrowserRouter>
                </MessageReducer>
            </AuthReducer>
        </ApolloProvider>
    );
}

export default App;
