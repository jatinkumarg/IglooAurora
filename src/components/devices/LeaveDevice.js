import React from "react"
import createMuiTheme from "@material-ui/core/styles/createMuiTheme"
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogActions from "@material-ui/core/DialogActions"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
  },
})

const MOBILE_WIDTH = 500

function Transition(props) {
  return window.innerWidth > MOBILE_WIDTH ? (
    <Grow {...props} />
  ) : (
    <Slide direction="up" {...props} />
  )
}

class LeaveDevice extends React.Component {
  deleteDeviceMutation = () => {
    this.props["DeleteDevice"]({
      variables: {
        id: this.props.device.id,
      },
      optimisticResponse: {
        __typename: "Mutation",
        deleteDevice: {
          id: this.props.device.id,
        },
      },
    })
    this.props.close()
  }

  stopSharing = () => {
    this.props.StopSharing({
      variables: {
        deviceId: this.props.device.id,
        email: this.props.userData.user.email,
      },
      optimisticResponse: {
        __typename: "Mutation",
        stopSharing: {
          id: this.props.device.id,
          email: this.props.userData.user.email,
          __typename: "Device",
        },
      },
    })
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.close}
        className="notSelectable defaultCursor"
        titleClassName="notSelectable defaultCursor"
        TransitionComponent={Transition}
        fullScreen={window.innerWidth < MOBILE_WIDTH}
      >
        <DialogTitle style={{ width: "350px" }}>Leave device</DialogTitle>
        <div
          style={{ paddingLeft: "24px", paddingRight: "24px", height: "100%" }}
        >
          Are you sure you want to leave {this.props.device.customName}?
        </div>
        <br />
        <DialogActions style={{ marginLeft: "8px", marginRight: "8px" }}>
          <MuiThemeProvider theme={theme}>
            <Button onClick={this.props.close} style={{ marginRight: "4px" }}>
              Never mind
            </Button>
            <Button
              variant="raised"
              color="primary"
              primary={true}
              onClick={() => {
                this.stopSharing()
                this.props.close()
              }}
            >
              Leave device
            </Button>
          </MuiThemeProvider>
        </DialogActions>
      </Dialog>
    )
  }
}

export default graphql(
  gql`
    mutation StopSharing($email: String!, $deviceId: ID!) {
      stopSharingDevice(email: $email, deviceId: $deviceId) {
        id
      }
    }
  `,
  {
    name: "StopSharing",
  }
)(
  graphql(
    gql`
      mutation DeleteDevice($id: ID!) {
        deleteDevice(id: $id)
      }
    `,
    {
      name: "DeleteDevice",
    }
  )(LeaveDevice)
)
