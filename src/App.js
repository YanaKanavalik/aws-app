import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Auth, API, graphqlOperation} from 'aws-amplify';
import awsconfig from './aws-exports';
import {withAuthenticator} from 'aws-amplify-react';
import * as queries from './graphql/queries';
import * as mutations from './graphql/mutations';

Auth.configure(awsconfig);
API.configure(awsconfig);

const updateTodo = (todo, newDescr) => {
    todo.description = newDescr;

    API.graphql(graphqlOperation(mutations.updateTodo, {input: todo}))
};

const deleteTodo = todo => {
  API.graphql(graphqlOperation(mutations.deleteTodo, {input: {id: todo.id}}))
};

function App() {
    const allTodos = API.graphql(graphqlOperation(queries.listTodos));
    console.log(allTodos);

    const oneTodo = API.graphql(graphqlOperation(queries.getTodo, {id: "6c1b3f97-424a-499f-8b06-a3343c612003"})).then(
        todo => {
            updateTodo(todo.data.getTodo, "new description")

            //deleteTodo(todo.data.getTodo)
        }
    );
    console.log(oneTodo);

    Auth.currentAuthenticatedUser({
        bypassCache: false
    }).then(user => {
        console.log("User: " + JSON.stringify(user));
        const todo = {name: user.username, description: "new todo"};
        const newTodo = API.graphql(graphqlOperation(mutations.createTodo, {input: todo}));

        console.log(newTodo);
    }).catch(err => console.log(err));

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <p>
                    Edit <code>src/App.js</code> and save to reload. Yanaaaa, NEW VERSION!
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default withAuthenticator(App, {includeGreetings: true});
