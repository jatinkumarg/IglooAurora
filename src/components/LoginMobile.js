import React, { Component } from "react"
import Button from "material-ui-next/Button"
import gql from "graphql-tag"
import { MuiThemeProvider, createMuiTheme } from "material-ui-next/styles"
import Input, { InputAdornment } from "material-ui-next/Input"
import { FormControl, FormHelperText } from "material-ui-next/Form"
import IconButton from "material-ui-next/IconButton"
import Icon from "material-ui-next/Icon"
import ForgotPassword from "./ForgotPassword"
import { Typography, Grid, FormControlLabel, Checkbox } from "material-ui-next"
import * as EmailValidator from "email-validator"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#fff" },
    secondary: { main: "#0083ff" },
  },
})

class LoginMobile extends Component {
  constructor() {
    super()
    let email = ""

    if (typeof Storage !== "undefined") {
      email = localStorage.getItem("email") || ""
    }

    this.state = {
      email,
      emailError: "",
      password: "",
      passwordError: "",
      forgotPasswordOpen: false,
      isMailEmpty: false,
      isPasswordEmpty: false,
      keepLoggedIn: true,
    }

    this.signIn = this.signIn.bind(this)
  }

  async signIn() {
    try {
      this.setState({ emailError: "", passwordError: "" })
      const loginMutation = await this.props.client.mutate({
        mutation: gql`
          mutation($email: String!, $password: String!) {
            AuthenticateUser(email: $email, password: $password) {
              id
              token
            }
          }
        `,
        variables: {
          email: this.state.email,
          password: this.state.password,
        },
      })

      if (typeof Storage !== "undefined") {
        localStorage.setItem("email", this.state.email)
      }

      this.props.signIn(loginMutation.data.AuthenticateUser.token)
    } catch (e) {
      if (e.message === "GraphQL error: Wrong password") {
        this.setState({ passwordError: "Wrong password" })
      } else if (
        e.message ===
        "GraphQL error: User doesn't exist. Use `SignupUser` to create one"
      ) {
        this.setState({
          emailError: "This account does not exist",
        })
      } else {
        console.log(e)
      }
    }
  }

  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword })
  }

  handleMouseDownPassword = event => {
    event.preventDefault()
  }

  handleClickCancelEmail = () => {
    this.setState({ email: "", isMailEmpty: true })
  }

  render() {
    return (
      <React.Fragment>
        <div className="rightSide notSelectable">
          <Typography
            variant="display1"
            gutterBottom
            className="defaultCursor"
            style={{ color: "white", textAlign: "center", fontSize: "2rem" }}
          >
            Welcome back!
          </Typography>
          <br />
          <MuiThemeProvider theme={theme}>
            <Grid
              container
              spacing={0}
              alignItems="flex-end"
              style={{ width: "100%" }}
            >
              <Grid item style={{ marginRight: "16px" }}>
                <Icon style={{ color: "white", marginBottom: "20px" }}>
                  email
                </Icon>
              </Grid>
              <Grid item style={{ width: "calc(100% - 40px)" }}>
                <FormControl style={{ width: "100%" }}>
                  <Input
                    id="adornment-email-login"
                    placeholder="Email"
                    style={{ color: "white" }}
                    value={this.state.email}
                    onChange={event =>
                      this.setState({
                        email: event.target.value,
                        isMailEmpty: event.target.value === "",
                      })
                    }
                    onKeyPress={event => {
                      if (event.key === "Enter") this.signIn()
                    }}
                    endAdornment={
                      this.state.email ? (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={this.handleClickCancelEmail}
                            onMouseDown={this.handleMouseDownPassword}
                            tabIndex="-1"
                            style={{ color: "white" }}
                          >
                            <Icon>clear</Icon>
                          </IconButton>
                        </InputAdornment>
                      ) : null
                    }
                  />
                  <FormHelperText
                    id="name-error-text-login"
                    style={{ color: "white" }}
                  >
                    {this.state.emailError}
                    {this.state.isMailEmpty ? "This field is required" : ""}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
            <br />
            <Grid
              container
              spacing={0}
              alignItems="flex-end"
              style={{ width: "100%" }}
            >
              <Grid item style={{ marginRight: "16px" }}>
                <Icon style={{ color: "white", marginBottom: "20px" }}>
                  vpn_key
                </Icon>
              </Grid>
              <Grid item style={{ width: "calc(100% - 40px)" }}>
                <FormControl style={{ width: "100%" }}>
                  <Input
                    id="adornment-password-login"
                    type={this.state.showPassword ? "text" : "password"}
                    value={this.state.password}
                    placeholder="Password"
                    style={{ color: "white" }}
                    onChange={event =>
                      this.setState({
                        password: event.target.value,
                        passwordError: "",
                        isPasswordEmpty: event.target.value === "",
                      })
                    }
                    onKeyPress={event => {
                      if (event.key === "Enter") this.signIn()
                    }}
                    endAdornment={
                      this.state.password ? (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={this.handleClickShowPassword}
                            onMouseDown={this.handleMouseDownPassword}
                            tabIndex="-1"
                            style={{ color: "white" }}
                          >
                            {this.state.showPassword ? (
                              <Icon style={{ color: "white" }}>
                                visibility_off
                              </Icon>
                            ) : (
                              <Icon style={{ color: "white" }}>visibility</Icon>
                            )}
                          </IconButton>
                        </InputAdornment>
                      ) : null
                    }
                  />
                  <FormHelperText
                    id="passowrd-error-text-login"
                    style={{ color: "white" }}
                  >
                    {this.state.passwordError}
                    {this.state.isPasswordEmpty ? "This field is required" : ""}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
            <FormControlLabel
              control={
                <MuiThemeProvider
                  theme={createMuiTheme({
                    palette: {
                      secondary: { main: "#fff" },
                    },
                  })}
                >
                  <Checkbox
                    checked={this.state.keepLoggedIn}
                    onChange={event =>
                      this.setState({ keepLoggedIn: event.target.checked })
                    }
                  />
                </MuiThemeProvider>
              }
              label="Keep me logged in"
              style={{ color: "white" }}
            />
            <br />
            <div style={{ textAlign: "right" }}>
              <font
                style={{
                  cursor: "pointer",
                  color: "white",
                }}
                onClick={() => {
                  this.setState({ forgotPasswordOpen: true })
                }}
              >
                Forgot password?
              </font>
            </div>
            <br />
            <br />
            <Button
              variant="raised"
              primary={true}
              fullWidth={true}
              onClick={this.signIn}
              color="secondary"
              disabled={
                !(
                  EmailValidator.validate(this.state.email) &&
                  this.state.password
                )
              }
            >
              Log in
            </Button>
          </MuiThemeProvider>
        </div>
        <ForgotPassword
          open={this.state.forgotPasswordOpen}
          close={() => this.setState({ forgotPasswordOpen: false })}
        />
      </React.Fragment>
    )
  }
}

export default LoginMobile
