import React, { Component } from "react"
import { ApolloClient } from "apollo-client"
import { HttpLink } from "apollo-link-http"
import { InMemoryCache } from "apollo-cache-inmemory"
import Paper from "material-ui/Paper"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import Login from "./components/Login"
import Signup from "./components/Signup"
import SwipeableViews from "react-swipeable-views"
import BottomNavigation, {
  BottomNavigationAction,
} from "material-ui-next/BottomNavigation"
import Button from "material-ui-next/Button"
import { hotkeys } from "react-keyboard-shortcuts"
import Icon from "material-ui-next/Icon"
import Dialog from "material-ui-next/Dialog"

class UnAuthenticatedApp extends Component {
  state = { slideIndex: 0, logiIn: false, signIn: false }

  hot_keys = {
    "alt+1": {
      priority: 1,
      handler: event => this.setState({ slideIndex: 0 }),
    },
    "alt+2": {
      priority: 1,
      handler: event => this.setState({ slideIndex: 1 }),
    },
  }

  constructor() {
    super()

    const link = new HttpLink({
      uri: "https://iglooql.herokuapp.com/graphql",
    })

    this.client = new ApolloClient({
      // By default, this client will send queries to the
      //  `/graphql` endpoint on the same host
      link,
      cache: new InMemoryCache(),
    })

    let slideIndex = 0
    if (typeof Storage !== "undefined" && localStorage.getItem("email")) {
      slideIndex = 1
    }
    this.state = {
      slideIndex,
    }
  }

  handleChange = (event, value) => {
    this.setState({ slideIndex: value })
  }

  handleChangeIndex = index => {
    this.setState({ slideIndex: index })
  }

  render() {
    return (
      <MuiThemeProvider>
        <Paper className="loginForm">
          <div className="leftSide notSelectable">
            <br />
            <br />
            <img
              alt="Igloo Logo"
              src="./assets/logo.svg"
              width="300"
              className="logo notSelectable"
            />
            <br />
            <br />

            <b>
              <img
                alt="Igloo"
                src="./assets/iglooTitle.svg"
                width="300"
                className="unauthenticatedTitle notSelectable"
              />
            </b>
          </div>
          <div>
            <Button
              color="primary"
              primary={true}
              buttonStyle={{ backgroundColor: "#0083ff" }}
              onClick={() => this.setState({ signIn: true })}
            >
              Sign up
            </Button>
            <Button
              variant="raised"
              color="primary"
              primary={true}
              buttonStyle={{ backgroundColor: "#0083ff" }}
              onClick={() => this.setState({ logIn: true })}
            >
              Log in
            </Button>
            <Dialog open={this.state.signIn}>
              <Signup
                client={this.client}
                signIn={this.props.signIn}
                goToLogin={() => this.setState({ slideIndex: 1 })}
              />
            </Dialog>
            <Dialog open={this.state.logIn}>
              <Login
                client={this.client}
                signIn={this.props.signIn}
                goToSignup={() => this.setState({ slideIndex: 0 })}
              />
            </Dialog>
          </div>
        </Paper>
      </MuiThemeProvider>
    )
  }
}

export default hotkeys(UnAuthenticatedApp)