import React from "react"
import Dialog from "material-ui/Dialog"
import Button from "material-ui-next/Button"
import TextField from "material-ui/TextField"
import { List, ListItem } from "material-ui/List"
import IconButton from "material-ui-next/IconButton"
import { MuiThemeProvider, createMuiTheme } from "material-ui-next/styles"
import Icon from "material-ui-next/Icon"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import CenteredSpinner from "../CenteredSpinner"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
    secondary: { main: "#ff4081" },
  },
})

const authDialogContentStyle = {
  width: "350px",
}

class AuthDialog extends React.Component {
  state = {
    authSnackOpen: false,
    authDialogOpen: false,
    tokenName: "",
  }

  getPermanentToken = () => {
    this.props["GeneratePermanentAccessToken"]({
      variables: {
        customName: this.state.tokenName,
      },
    })
    this.setState({ nameOpen: false, authDialogOpen: true })
  }

  deletePermanentToken = tokenID => {
    this.props["DeletePermanentAccesToken"]({
      variables: {
        id: tokenID,
      },
    })
  }

  openAuthDialog = () => {
    this.setState({ authDialogOpen: true })
    this.props.handleAuthDialogClose()
  }

  closeAuthDialog = () => {
    this.setState({ authDialogOpen: false })
  }

  render() {
    const {
      permanentTokens: { loading, error, user },
    } = this.props

    const confirmationDialogActions = [
      <MuiThemeProvider theme={theme}>
        <Button onClick={this.props.handleAuthDialogClose}>Never Mind</Button>
        <Button variant="raised" color="primary" onClick={this.openAuthDialog}>
          Proceed
        </Button>
      </MuiThemeProvider>,
    ]

    const authDialogActions = [
      <MuiThemeProvider theme={theme}>
        <Button onClick={this.closeAuthDialog}>Close</Button>
      </MuiThemeProvider>,
    ]

    const tokenNameActions = [
      <MuiThemeProvider theme={theme}>
        <Button
          onClick={() =>
            this.setState({ nameOpen: false, authDialogOpen: true })
          }
        >
          Never mind
        </Button>
        <Button
          variant="raised"
          color="primary"
          onClick={() => this.getPermanentToken()}
        >
          Obtain token
        </Button>
      </MuiThemeProvider>,
    ]

    let tokens

    if (error) tokens = "Unexpected error"

    if (loading) tokens = <CenteredSpinner />

    if (user) {
      tokens = user.permanentTokens.map(token => (
        <ListItem
          primaryText={token.customName}
          leftIcon={<Icon>vpn_key</Icon>}
          rightIconButton={
            <IconButton onClick={() => this.deletePermanentToken(token.id)}>
              <Icon>delete</Icon>
            </IconButton>
          }
        />
      ))
    }

    return (
      <React.Fragment>
        <Dialog
          title="Type your password"
          actions={confirmationDialogActions}
          open={this.props.confirmationDialogOpen}
          contentStyle={authDialogContentStyle}
          onRequestClose={this.props.handleAuthDialogClose}
          className="notSelectable"
          titleClassName="notSelectable defaultCursor"
        >
          <TextField
            floatingLabelShrinkStyle={{ color: "#0083ff" }}
            underlineFocusStyle={{ borderColor: "#0083ff" }}
            floatingLabelText="Password"
            type="password"
            style={{ width: "100%" }}
            onKeyPress={event => {
              if (event.key === "Enter") this.openAuthDialog()
            }}
          />
        </Dialog>
        <Dialog
          title="Manage authorizations"
          actions={authDialogActions}
          open={this.state.authDialogOpen}
          contentStyle={authDialogContentStyle}
          onRequestClose={this.closeAuthDialog}
          className="notSelectable"
          bodyStyle={{
            paddingLeft: "8px",
            paddingRight: "8px",
            paddingBottom: "0px",
          }}
          titleClassName="notSelectable defaultCursor"
        >
          <List>
            {tokens}
            <ListItem
              primaryText="Get a new permanent token"
              leftIcon={<Icon>add</Icon>}
              onClick={() =>
                this.setState({ nameOpen: true, authDialogOpen: false })
              }
            />
          </List>
        </Dialog>
        <Dialog
          title="Choose a token name"
          actions={tokenNameActions}
          open={this.state.nameOpen}
          contentStyle={authDialogContentStyle}
          onRequestClose={() => this.setState({ nameOpen: false })}
          className="notSelectable"
        >
          <TextField
            floatingLabelShrinkStyle={{ color: "#0083ff" }}
            underlineFocusStyle={{ borderColor: "#0083ff" }}
            floatingLabelText="Token name"
            style={{ width: "100%" }}
            onChange={event => this.setState({ tokenName: event.target.value })}
            onKeyPress={event => {
              if (event.key === "Enter") () => this.getPermanentToken()
            }}
          />
        </Dialog>
      </React.Fragment>
    )
  }
}

export default graphql(
  gql`
    query {
      user {
        permanentTokens {
          id
          customName
        }
      }
    }
  `,
  { name: "permanentTokens" }
)(
  graphql(
    gql`
      mutation GeneratePermanentAccessToken($customName: String) {
        GeneratePermanentAccessToken(customName: $customName) {
          token
        }
      }
    `,
    {
      name: "GeneratePermanentAccessToken",
    }
  )(
    graphql(
      gql`
        mutation DeletePermanentAccesToken($id: ID!) {
          DeletePermanentAccesToken(id: $id)
        }
      `,
      {
        name: "DeletePermanentAccesToken",
      }
    )(AuthDialog)
  )
)
