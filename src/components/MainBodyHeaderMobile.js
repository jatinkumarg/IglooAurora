import React, { Component } from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Dialog from "material-ui/Dialog"
import NotificationsDrawer from "./NotificationsDrawer"
import DeviceInfo from "./DeviceInfo"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { Link } from "react-router-dom"
import {
  Divider,
  Button,
  Tooltip,
  Icon,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core"
import DeleteDevice from "./DeleteDevice"
import ChangeBoard from "./ChangeBoard"
import RenameDevice from "./RenameDevice"

class MainBodyHeader extends Component {
  state = {
    open: false,
    infoOpen: false,
    anchorEl: null,
    deleteOpen: false,
    changeBoardOpen:false,
    renameOpen:false
  }

  handleOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  handleMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleMenuClose = () => {
    this.setState({ anchorEl: null })
  }

  render() {
    const actions = [<Button onClick={this.handleClose}>Close</Button>]

    const { loading, error, device } = this.props.data

    if (loading) {
      return (
        <div
          className="mainBodyHeader"
          style={{ height: "64px", width: "100vw" }}
        >
          <Tooltip id="tooltip-bottom" title="Device list" placement="bottom">
            <Link
              to="/dashboard/"
              style={{ textDecoration: "none", color: "black" }}
            >
              <IconButton
                style={{
                  color: "white",
                  marginTop: "auto",
                  marginBottom: "auto",
                  marginLeft: "8px",
                }}
                onClick={() => this.props.selectDevice(null)}
              >
                <Icon>chevron_left</Icon>
              </IconButton>
            </Link>
          </Tooltip>
        </div>
      )
    }

    if (error) {
      return <div className="mainBodyHeader" />
    }

    return (
      <React.Fragment>
        <div
          className="mobileMainBodyHeader notSelectable"
          style={{
            color: "white",
            height: "64px",
          }}
        >
          <div className="mobileBackIcon">
            <Tooltip id="tooltip-bottom" title="Device list" placement="bottom">
              <Link
                to={"/dashboard?board=" + this.props.selectedBoard}
                style={{ textDecoration: "none", color: "black" }}
              >
                <IconButton
                  style={{
                    color: "white",
                  }}
                  onClick={() => this.props.selectDevice(null)}
                >
                  <Icon>chevron_left</Icon>
                </IconButton>
              </Link>
            </Tooltip>
          </div>
          {device.icon ? (
            <img
              className="deviceIconBig"
              src={device.icon}
              alt="device logo"
            />
          ) : (
            <i
              className="deviceIconBig material-icons"
              style={{ cursor: "default" }}
            >
              lightbulb_outline
            </i>
          )}
          <p className="title" style={{ cursor: "default" }}>
            {device.customName}
          </p>
          <div
            style={{
              padding: "0",
              marginLeft: "auto",
              marginRight: "8px",
              float: "right",
              gridArea: "buttons",
            }}
          >
            <Tooltip id="tooltip-more" title="More" placement="bottom">
              <IconButton
                style={{ color: "white" }}
                onClick={this.handleMenuOpen}
              >
                <Icon>more_vert</Icon>
              </IconButton>
            </Tooltip>
            <Menu
              id="simple-menu"
              anchorEl={this.state.anchorEl}
              open={this.state.anchorEl}
              onClose={this.handleMenuClose}
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
                className="notSelectable"
                style={
                  this.props.nightMode ? { color: "white" } : { color: "black" }
                }
                onClick={() => {
                  this.setState({ infoOpen: true })
                  this.handleMenuClose()
                }}
              >
                <ListItemIcon>
                  <Icon
                    style={
                      this.props.nightMode
                        ? { color: "white" }
                        : { color: "black" }
                    }
                  >
                    info
                  </Icon>
                </ListItemIcon>
                <ListItemText inset primary="Device information" />
              </MenuItem>
              {/* <MenuItem
                    className="notSelectable"
                    style={
                      this.props.nightMode
                        ? { color: "white" }
                        : { color: "black" }
                    }
                  >
                    <ListItemIcon>
                      <Icon
                        style={
                          this.props.nightMode
                            ? { color: "white" }
                            : { color: "black" }
                        }
                      >
                        place
                      </Icon>
                    </ListItemIcon>
                    <ListItemText inset primary="See on the map" />
                  </MenuItem> */}
              {navigator.share ? (
                <MenuItem
                  className="notSelectable"
                  style={
                    this.props.nightMode
                      ? { color: "white" }
                      : { color: "black" }
                  }
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: device.customName + " on Igloo Aurora",
                        url: window.location.href,
                      })
                    }
                  }}
                >
                  <ListItemIcon>
                    <Icon
                      style={
                        this.props.nightMode
                          ? { color: "white" }
                          : { color: "black" }
                      }
                    >
                      share
                    </Icon>
                  </ListItemIcon>
                  <ListItemText inset primary="Share" />
                </MenuItem>
              ) : (
                ""
              )}
              {!navigator.share ? (
                <CopyToClipboard text={window.location.href}>
                  <MenuItem
                    className="notSelectable"
                    style={
                      this.props.nightMode
                        ? { color: "white" }
                        : { color: "black" }
                    }
                    onClick={() => {
                      this.setState({ anchorEl: null })
                      this.props.openSnackBar()
                    }}
                  >
                    <ListItemIcon>
                      <Icon
                        style={
                          this.props.nightMode
                            ? { color: "white" }
                            : { color: "black" }
                        }
                      >
                        link
                      </Icon>
                    </ListItemIcon>
                    <ListItemText inset primary="Get Link" />
                  </MenuItem>
                </CopyToClipboard>
              ) : (
                ""
              )}
              <Divider />
              <MenuItem
                className="notSelectable"
                style={
                  this.props.nightMode ? { color: "white" } : { color: "black" }
                }
                onClick={() => {
                  this.handleMenuClose()
                }}
              >
                <ListItemIcon>
                  <Icon
                    style={
                      this.props.nightMode
                        ? { color: "white" }
                        : { color: "black" }
                    }
                  >
                    notifications_off
                  </Icon>
                </ListItemIcon>
                <ListItemText inset primary="Mute" />
              </MenuItem>
              <Divider />
              <MenuItem
                className="notSelectable"
                style={
                  this.props.nightMode ? { color: "white" } : { color: "black" }
                }
                onClick={() => {
                  this.handleMenuClose()
                }}
              >
                <ListItemIcon>
                  <Icon
                    style={
                      this.props.nightMode
                        ? { color: "white" }
                        : { color: "black" }
                    }
                  >
                    widgets
                  </Icon>
                </ListItemIcon>
                <ListItemText inset primary="Change board" />
              </MenuItem>
              <MenuItem
                className="notSelectable"
                style={
                  this.props.nightMode ? { color: "white" } : { color: "black" }
                }
                onClick={() => {
                  this.handleOpen()
                  this.handleMenuClose()
                }}
              >
                <ListItemIcon>
                  <Icon
                    style={
                      this.props.nightMode
                        ? { color: "white" }
                        : { color: "black" }
                    }
                  >
                    swap_vert
                  </Icon>
                </ListItemIcon>
                <ListItemText inset primary="Rearrange cards" />
              </MenuItem>
              <MenuItem
                className="notSelectable"
                style={
                  this.props.nightMode ? { color: "white" } : { color: "black" }
                }
                onClick={() => {
                  this.handleMenuClose()
                }}
              >
                <ListItemIcon>
                  <Icon
                    style={
                      this.props.nightMode
                        ? { color: "white" }
                        : { color: "black" }
                    }
                  >
                    mode_edit
                  </Icon>
                </ListItemIcon>
                <ListItemText inset primary="Rename" />
              </MenuItem>
              <MenuItem
                className="notSelectable"
                style={
                  this.props.nightMode ? { color: "white" } : { color: "black" }
                }
                onClick={() => {
                  this.setState({ deleteOpen: true })
                  this.handleMenuClose()
                }}
              >
                <ListItemIcon>
                  <Icon style={{ color: "#f44336" }}>delete</Icon>
                </ListItemIcon>
                <ListItemText inset>
                  <span style={{ color: "#f44336" }}>Delete</span>
                </ListItemText>
              </MenuItem>
            </Menu>
            <NotificationsDrawer
              device={device}
              drawer={this.props.drawer}
              changeDrawerState={this.props.changeDrawerState}
              hiddenNotifications={this.props.hiddenNotifications}
              showHiddenNotifications={this.props.showHiddenNotifications}
              nightMode={this.props.nightMode}
            />
          </div>
        </div>
        <Dialog
          title="Rearrange cards"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          className="notSelectable"
        >
          [FILL WITH DRAG 'N' DROPPABLE LIST]
        </Dialog>
        <DeviceInfo
          infoOpen={this.state.infoOpen}
          close={() => this.setState({ infoOpen: false })}
          id={device.id}
          updatedAt={device.updatedAt}
          createdAt={device.createdAt}
          devMode={this.props.devMode}
        />
        <ChangeBoard
          open={this.state.changeBoardOpen}
          close={() => this.setState({ changeBoardOpen: false })}
          userData={this.props.userData}
          device={device}
        />
        <RenameDevice
          open={this.state.renameOpen}
          close={() => this.setState({ renameOpen: false })}
          device={device}
        />
        <DeleteDevice
          open={this.state.deleteOpen}
          close={() => this.setState({ deleteOpen: false })}
          device={device}
        />
      </React.Fragment>
    )
  }
}

export default graphql(
  gql`
    query($id: ID!) {
      device(id: $id) {
        id
        board {
          id
        }
        customName
        icon
        updatedAt
        createdAt
      }
    }
  `,
  {
    options: ({ deviceId }) => ({
      variables: {
        id: deviceId,
      },
    }),
  }
)(MainBodyHeader)
