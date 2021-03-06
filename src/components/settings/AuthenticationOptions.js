import React from "react"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogTitle from "@material-ui/core/DialogTitle"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import withMobileDialog from "@material-ui/core/withMobileDialog"
import gql from "graphql-tag"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import Fingerprint from "@material-ui/icons/Fingerprint"
import TextField from "@material-ui/core/TextField"
import IconButton from "@material-ui/core/IconButton"
import VisibilityOff from "@material-ui/icons/VisibilityOff"
import Visibility from "@material-ui/icons/Visibility"
import CenteredSpinner from "../CenteredSpinner"
import InputAdornment from "@material-ui/core/InputAdornment"
import ToggleIcon from "material-ui-toggle-icon"
import List from "@material-ui/core/List"
import ListSubheader from "@material-ui/core/ListSubheader"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import SvgIcon from "@material-ui/core/SvgIcon"
import MoreVert from "@material-ui/icons/MoreVert"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import Create from "@material-ui/icons/Create"
import RemoveCircle from "@material-ui/icons/RemoveCircle"
import { ApolloClient } from "apollo-client"
import { HttpLink } from "apollo-link-http"
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from "apollo-cache-inmemory"
import { WebSocketLink } from "apollo-link-ws"
import { split } from "apollo-link"
import { getMainDefinition } from "apollo-utilities"
import introspectionQueryResultData from "../../fragmentTypes.json"

function str2ab(str) {
  return Uint8Array.from(str, c => c.charCodeAt(0))
}

function ab2str(ab) {
  return Array.from(new Int8Array(ab))
}

function GrowTransition(props) {
  return <Grow {...props} />
}

function SlideTransition(props) {
  return <Slide direction="up" {...props} />
}

class AuthenticationOptions extends React.Component {
  state = { selectAuthTypeOpen: false }

  createToken = async () => {
    try {
      this.setState({ showLoading: true })

      let createTokenMutation = await this.props.client.mutate({
        mutation: gql`
          mutation($tokenType: TokenType!, $password: String!) {
            createToken(tokenType: $tokenType, password: $password)
          }
        `,
        variables: {
          tokenType: "CHANGE_AUTHENTICATION",
          password: this.state.password,
        },
      })

      this.setState({
        token: createTokenMutation.data.createToken,
        selectAuthTypeOpen: true,
        showDeleteLoading: false,
      })
    } catch (e) {
      if (e.message === "GraphQL error: Wrong password") {
        this.setState({ passwordError: "Wrong password" })
      } else if (
        e.message ===
        "GraphQL error: User doesn't exist. Use `signUp` to create one"
      ) {
        this.setState({ passwordError: "This account doesn't exist" })
      } else {
        this.setState({
          passwordError: "Unexpected error",
        })
      }
    }

    this.setState({ showLoading: false })
  }

  changePassword = async () => {
    const wsLink = new WebSocketLink({
      uri:
        typeof Storage !== "undefined" && localStorage.getItem("server") !== ""
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
        typeof Storage !== "undefined" && localStorage.getItem("server") !== ""
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

    try {
      this.client.mutate({
        mutation: gql`
          mutation($newPassword: String!) {
            changePassword(newPassword: $newPassword) {
              token
            }
          }
        `,
        variables: {
          newPassword: this.state.newPassword,
        },
      })

      this.setState({
        newPasswordDialogOpen: false,
      })
    } catch (e) {
      if (e.message === "GraphQL error: Wrong password") {
        this.setState({ emailError: "Wrong password" })
      } else if (
        e.message === "GraphQL error: A user with this email already exists"
      ) {
        this.setState({ emailError: "Email already taken" })
      } else {
        this.setState({
          emailError: "Unexpected error",
        })
      }

      this.setState({ showLoading: false })
    }
  }

  enableWebAuthn = async () => {
    const wsLink = new WebSocketLink({
      uri:
        typeof Storage !== "undefined" && localStorage.getItem("server") !== ""
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
        typeof Storage !== "undefined" && localStorage.getItem("server") !== ""
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

    const {
      data: { getWebAuthnEnableChallenge },
    } = await this.client.query({
      query: gql`
        query getWebauthnSignUpChallenge($email: String!) {
          getWebAuthnEnableChallenge(email: $email) {
            publicKeyOptions
            jwtChallenge
          }
        }
      `,
      variables: {
        email: this.props.user.email,
      },
    })

    const publicKeyOptions = JSON.parse(
      getWebAuthnEnableChallenge.publicKeyOptions
    )

    publicKeyOptions.challenge = str2ab(publicKeyOptions.challenge)
    publicKeyOptions.user.id = str2ab(publicKeyOptions.user.id)

    let sendResponse = async res => {
      let payload = { response: {} }
      payload.rawId = ab2str(res.rawId)
      payload.response.attestationObject = ab2str(
        res.response.attestationObject
      )
      payload.response.clientDataJSON = ab2str(res.response.clientDataJSON)

      await this.client.mutate({
        mutation: gql`
          mutation($jwtChallenge: String!, $challengeResponse: String!) {
            enableWebauthn(
              jwtChallenge: $jwtChallenge
              challengeResponse: $challengeResponse
            )
          }
        `,
        variables: {
          challengeResponse: JSON.stringify(payload),
          jwtChallenge: getWebAuthnEnableChallenge.jwtChallenge,
        },
      })
    }

    navigator.credentials
      .create({ publicKey: publicKeyOptions })
      .then(sendResponse)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.open !== nextProps.open && nextProps.open) {
      this.setState({
        isPasswordEmpty: false,
        passwordError: false,
        password: "",
        showPassword: false,
      })
    }
  }

  render() {
    const { user } = this.props

    let webAuthnListItem = (
      <ListItem>
        <ListItemIcon>
          <Fingerprint />
        </ListItemIcon>
        <ListItemText
          primary={
            <font
              style={
                typeof Storage !== "undefined" &&
                localStorage.getItem("nightMode") === "true"
                  ? { color: "white" }
                  : {}
              }
            >
              Fingerprint, face or security key
            </font>
          }
        />
        <ListItemSecondaryAction>
          <IconButton
            onClick={event =>
              this.setState({
                menuTarget: "webauthn",
                anchorEl: event.currentTarget,
              })
            }
            style={
              typeof Storage !== "undefined" &&
              localStorage.getItem("nightMode") === "true"
                ? {
                    color: "white",
                  }
                : { color: "black" }
            }
          >
            <MoreVert />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    )

    let passwordListItem = (
      <ListItem>
        <ListItemIcon>
          <SvgIcon>
            <svg style={{ width: "24px", height: "24px" }} viewBox="0 0 24 24">
              <path d="M17,7H22V17H17V19A1,1 0 0,0 18,20H20V22H17.5C16.95,22 16,21.55 16,21C16,21.55 15.05,22 14.5,22H12V20H14A1,1 0 0,0 15,19V5A1,1 0 0,0 14,4H12V2H14.5C15.05,2 16,2.45 16,3C16,2.45 16.95,2 17.5,2H20V4H18A1,1 0 0,0 17,5V7M2,7H13V9H4V15H13V17H2V7M20,15V9H17V15H20M8.5,12A1.5,1.5 0 0,0 7,10.5A1.5,1.5 0 0,0 5.5,12A1.5,1.5 0 0,0 7,13.5A1.5,1.5 0 0,0 8.5,12M13,10.89C12.39,10.33 11.44,10.38 10.88,11C10.32,11.6 10.37,12.55 11,13.11C11.55,13.63 12.43,13.63 13,13.11V10.89Z" />
            </svg>
          </SvgIcon>
        </ListItemIcon>
        <ListItemText
          primary={
            <font
              style={
                typeof Storage !== "undefined" &&
                localStorage.getItem("nightMode") === "true"
                  ? { color: "white" }
                  : {}
              }
            >
              Password
            </font>
          }
        />
        <ListItemSecondaryAction>
          <IconButton
            onClick={event =>
              this.setState({
                menuTarget: "password",
                anchorEl: event.currentTarget,
              })
            }
            style={
              typeof Storage !== "undefined" &&
              localStorage.getItem("nightMode") === "true"
                ? {
                    color: "white",
                  }
                : { color: "black" }
            }
          >
            <MoreVert />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    )

    return (
      <React.Fragment>
        <Dialog
          open={this.props.open && !this.state.selectAuthTypeOpen}
          onClose={() => this.props.close()}
          className="notSelectable"
          TransitionComponent={
            this.props.fullScreen ? SlideTransition : GrowTransition
          }
          fullScreen={this.props.fullScreen}
          disableBackdropClick={this.props.fullScreen}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle disableTypography>Type your password</DialogTitle>
          <div
            style={{
              height: "100%",
              paddingRight: "24px",
              paddingLeft: "24px",
            }}
          >
            <TextField
              id="passwordless-authentication-password"
              label="Password"
              type={this.state.showPassword ? "text" : "password"}
              value={this.state.password}
              variant="outlined"
              error={this.state.passwordEmpty || this.state.passwordError}
              helperText={
                this.state.passwordEmpty
                  ? "This field is required"
                  : this.state.passwordError || " "
              }
              onChange={event =>
                this.setState({
                  password: event.target.value,
                  passwordEmpty: event.target.value === "",
                  passwordError: "",
                })
              }
              onKeyPress={event => {
                if (event.key === "Enter" && this.state.password !== "")
                  this.createToken()
              }}
              style={{
                width: "100%",
              }}
              InputLabelProps={this.state.password && { shrink: true }}
              InputProps={{
                endAdornment: this.state.password && (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        this.setState(oldState => ({
                          showPassword: !oldState.showPassword,
                        }))
                      }
                      tabIndex="-1"
                      style={
                        typeof Storage !== "undefined" &&
                        localStorage.getItem("nightMode") === "true"
                          ? { color: "rgba(0, 0, 0, 0.46)" }
                          : { color: "rgba(0, 0, 0, 0.46)" }
                      }
                    >
                      {/* fix for ToggleIcon glitch on Edge */}
                      {document.documentMode ||
                      /Edge/.test(navigator.userAgent) ? (
                        this.state.showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )
                      ) : (
                        <ToggleIcon
                          on={this.state.showPassword || false}
                          onIcon={<VisibilityOff />}
                          offIcon={<Visibility />}
                        />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <DialogActions>
            <Button onClick={this.props.close}>Never mind</Button>
            <Button
              variant="contained"
              color="primary"
              onClick={this.createToken}
              disabled={!this.state.password || this.state.showLoading}
            >
              Proceed
              {this.state.showLoading && <CenteredSpinner isInButton />}
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={
            this.state.selectAuthTypeOpen && !this.state.newPasswordDialogOpen
          }
          onClose={() => {
            this.setState({ selectAuthTypeOpen: false })
            this.props.close()
          }}
          className="notSelectable"
          TransitionComponent={
            this.props.fullScreen ? SlideTransition : GrowTransition
          }
          fullScreen={this.props.fullScreen}
          disableBackdropClick={this.props.fullScreen}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle
            style={
              this.props.fullScreen
                ? typeof Storage !== "undefined" &&
                  localStorage.getItem("nightMode") === "true"
                  ? { width: "calc(100% - 48px)", background: "#2f333d" }
                  : { width: "calc(100% - 48px)", background: "#fff" }
                : typeof Storage !== "undefined" &&
                  localStorage.getItem("nightMode") === "true"
                ? { background: "#2f333d" }
                : { background: "#fff" }
            }
          >
            <font
              style={
                typeof Storage !== "undefined" &&
                localStorage.getItem("nightMode") === "true"
                  ? { color: "#fff" }
                  : {}
              }
            >
              Authentication methods
            </font>
          </DialogTitle>
          <div
            style={
              typeof Storage !== "undefined" &&
              localStorage.getItem("nightMode") === "true"
                ? {
                    height: "100%",
                    background: "#2f333d",
                  }
                : {
                    height: "100%",
                  }
            }
          >
            <List>
              <li key="yourEnvironments">
                <ul style={{ padding: "0" }}>
                  <ListSubheader
                    style={
                      typeof Storage !== "undefined" &&
                      localStorage.getItem("nightMode") === "true"
                        ? {
                            color: "white",
                          }
                        : { color: "black" }
                    }
                  >
                    Enabled
                  </ListSubheader>
                  {webAuthnListItem}
                  {passwordListItem}
                </ul>
              </li>
              <li key="yourEnvironments">
                <ul style={{ padding: "0" }}>
                  <ListSubheader
                    style={
                      typeof Storage !== "undefined" &&
                      localStorage.getItem("nightMode") === "true"
                        ? {
                            color: "white",
                          }
                        : { color: "black" }
                    }
                  >
                    Disabled
                  </ListSubheader>
                </ul>
              </li>
            </List>
          </div>
          <DialogActions>
            <Button onClick={() => {
            this.setState({ selectAuthTypeOpen: false })
            this.props.close()
          }}>
              <font
                style={
                  typeof Storage !== "undefined" &&
                  localStorage.getItem("nightMode") === "true"
                    ? { color: "white" }
                    : {}
                }
              >
                Close
              </font>
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.newPasswordDialogOpen}
          onClose={() => {
            this.props.close()
            this.setState({ newPasswordDialogOpen: false })
          }}
          className="notSelectable"
          TransitionComponent={
            this.props.fullScreen ? SlideTransition : GrowTransition
          }
          fullScreen={this.props.fullScreen}
          disableBackdropClick={this.props.fullScreen}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle disableTypography>Change password</DialogTitle>
          <div
            style={{
              paddingLeft: "24px",
              paddingRight: "24px",
              height: "100%",
            }}
          >
            <TextField
              id="change-new-password"
              label="New password"
              type={this.state.showNewPassword ? "text" : "password"}
              value={this.state.newPassword}
              variant="outlined"
              error={this.state.newPasswordEmpty || this.state.newPasswordError}
              helperText={
                this.state.newPasswordEmpty
                  ? "This field is required"
                  : this.state.newPasswordError || " "
              }
              onChange={event =>
                this.setState({
                  newPassword: event.target.value,
                  newPasswordEmpty: event.target.value === "",
                  newPasswordError: "",
                })
              }
              onKeyPress={event => {
                if (
                  event.key === "Enter" &&
                  this.state.newPassword !== "" &&
                  user
                )
                  this.createToken()
              }}
              style={{
                width: "100%",
              }}
              InputLabelProps={this.state.newPassword && { shrink: true }}
              InputProps={{
                endAdornment: this.state.newPassword && (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        this.setState(oldState => ({
                          showNewPassword: !oldState.showNewPassword,
                        }))
                      }
                      tabIndex="-1"
                      style={
                        typeof Storage !== "undefined" &&
                        localStorage.getItem("nightMode") === "true"
                          ? { color: "rgba(0, 0, 0, 0.46)" }
                          : { color: "rgba(0, 0, 0, 0.46)" }
                      }
                    >
                      {/* fix for ToggleIcon glitch on Edge */}
                      {document.documentMode ||
                      /Edge/.test(navigator.userAgent) ? (
                        this.state.showNewPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )
                      ) : (
                        <ToggleIcon
                          on={this.state.showNewPassword || false}
                          onIcon={<VisibilityOff />}
                          offIcon={<Visibility />}
                        />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <DialogActions>
            <Button
              onClick={() => {
                this.setState({ newPasswordDialogOpen: false })
              }}
            >
              Never mind
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => this.changePassword(this.state.newPassword)}
              disabled={this.state.newPassword === "" || !user}
            >
              Change
            </Button>
          </DialogActions>
        </Dialog>
        <Menu
          id="authentication-menu-target"
          anchorEl={this.state.anchorEl}
          open={this.state.anchorEl}
          onClose={() => this.setState({ anchorEl: null })}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem
            onClick={
              this.state.menuTarget === "password"
                ? () =>
                    this.setState({
                      anchorEl: false,
                      newPasswordDialogOpen: true,
                      isPasswordEmpty: false,
                      passwordError: false,
                      password: "",
                      showPassword: false,
                    })
                : () => {
                    this.enableWebAuthn()
                    this.setState({
                      anchorEl: false,
                    })
                  }
            }
          >
            <ListItemIcon>
              <Create />
            </ListItemIcon>
            <ListItemText
              inset
              primary={
                <font
                  style={
                    !this.props.unauthenticated &&
                    typeof Storage !== "undefined" &&
                    localStorage.getItem("nightMode") === "true"
                      ? { color: "white" }
                      : { color: "black" }
                  }
                >
                  Change
                </font>
              }
            />
          </MenuItem>
          <MenuItem
            onClick={() => {
              this.setState({ anchorEl: false })
            }}
          >
            <ListItemIcon>
              <RemoveCircle style={{ color: "#f44336" }} />
            </ListItemIcon>
            <ListItemText inset>
              <font style={{ color: "#f44336" }}>Remove</font>
            </ListItemText>
          </MenuItem>
        </Menu>
      </React.Fragment>
    )
  }
}

export default withMobileDialog({ breakpoint: "xs" })(AuthenticationOptions)
