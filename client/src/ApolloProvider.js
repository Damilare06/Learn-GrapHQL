import React from 'react'
import App from './App'
import { ApolloClient, ApolloLink, ApolloProvider, createHttpLink, InMemoryCache, setContext } from '@apollo/client';

const httpLink = createHttpLink({
    uri: 'http://localhost:5000'
});

const authLink = new ApolloLink((operation, forward)=>{
    const token = localStorage.getItem('jwtToken');
    operation.setContext(({headers})=>({
        headers: {
            Authorization: token ? `Bearer ${token}`: ''
        }
    }))
    return forward(operation)
})

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

export default (
    <ApolloProvider client={client}>
        <App/>
    </ApolloProvider>
);