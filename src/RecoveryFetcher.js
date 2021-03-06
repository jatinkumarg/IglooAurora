import React, { Component } from "react"
import { WebSocketLink } from "apollo-link-ws"
import { split } from "apollo-link"
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from "apollo-cache-inmemory"
import { ApolloClient } from "apollo-client"
import { HttpLink } from "apollo-link-http"
import introspectionQueryResultData from "./fragmentTypes.json"
import { getMainDefinition } from "apollo-utilities"
import { ApolloProvider } from "react-apollo"
import querystringify from "querystringify"
import { Redirect } from "react-router-dom"
import RecoveryMain from "./RecoveryMain"
import Helmet from "react-helmet"

export default class RecoveryFetcher extends Component {
  constructor(props) {
    super(props)

    this.state = {
      token: querystringify.parse("?" + window.location.href.split("?")[1])
        .token,
    }

    if (querystringify.parse("?" + window.location.href.split("?")[1]).token) {
      const wsLink = new WebSocketLink({
        uri:
          typeof Storage !== "undefined" &&
          localStorage.getItem("server") !== ""
            ? (localStorage.getItem("serverUnsecure") === "true"
                ? "ws://"
                : "wss://") +
              localStorage.getItem("server") +
              "/subscriptions"
            : `wss://bering.igloo.ooo/subscriptions`,
        options: {
          reconnect: true,
          connectionParams: {
            Authorization: "Bearer " + this.state.token,
          },
        },
      })

      const httpLink = new HttpLink({
        uri:
          typeof Storage !== "undefined" &&
          localStorage.getItem("server") !== ""
            ? (localStorage.getItem("serverUnsecure") === "true"
                ? "http://"
                : "https://") +
              localStorage.getItem("server") +
              "/graphql"
            : `https://bering.igloo.ooo/graphql`,
        headers: {
          Authorization: "Bearer " + this.state.token,
        },
      })

      const link = split(
        // split based on operation type
        ({ query }) => {
          const { kind, operation } = getMainDefinition(query)
          return kind === "OperationDefinition" && operation === "subscription"
        },
        wsLink,
        httpLink
      )

      const fragmentMatcher = new IntrospectionFragmentMatcher({
        introspectionQueryResultData,
      })

      this.client = new ApolloClient({
        // By default, this client will send queries to the
        //  `/graphql` endpoint on the same host
        link,
        cache: new InMemoryCache({ fragmentMatcher }),
      })
    }
  }

  render() {
    return (
      <React.Fragment>
        <Helmet>
          <title>Igloo Aurora - Recovery</title>
        </Helmet>
        {querystringify.parse("?" + window.location.href.split("?")[1])
          .token ? (
          <ApolloProvider client={this.client}>
            <RecoveryMain
              mobile={this.props.mobile}
              token={this.state.token}
              client={this.client}
              logOut={this.props.logOut}
            />
          </ApolloProvider>
        ) : (
          <Redirect to="/" />
        )}
      </React.Fragment>
    )
  }
}
