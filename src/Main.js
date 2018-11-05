import React, { Component } from "react"
import Sidebar from "./components/Sidebar"
import SidebarHeader from "./components/SidebarHeader"
import MainBody from "./components/MainBody"
import MainBodyHeader from "./components/MainBodyHeader"
import SettingsDialog from "./components/settings/SettingsDialog"
import { Offline, Online } from "react-detect-offline"
import "./styles/App.css"
import "./styles/Tiles.css"
import { hotkeys } from "react-keyboard-shortcuts"
import StatusBar from "./components/devices/StatusBar"
import { Redirect } from "react-router-dom"
import Typography from "@material-ui/core/Typography"
import polarBear from "./styles/assets/polarBear.svg"
import queryString from "query-string"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Helmet from "react-helmet"

class Main extends Component {
  state = {
    drawer: false,
    showMainHidden: false,
    hiddenNotifications: false,
    slideIndex: 0,
    areSettingsOpen: false,
  }

  changeDrawerState = () => {
    if (!this.state.areSettingsOpen)
      this.setState(oldState => ({
        drawer: !oldState.drawer,
      }))
  }

  hot_keys = {
    "alt+s": {
      priority: 1,
      handler: event => {
        !this.state.drawer
          ? this.setState(oldState => ({
              showMainHidden: !oldState.showMainHidden,
            }))
          : this.setState(oldState => ({
              hiddenNotifications: !oldState.hiddenNotifications,
            }))
      },
    },
    "alt+1": {
      priority: 1,
      handler: event => {
        const {
          boardData: { board },
        } = this.props

        if (board) {
          if (
            this.props.boardData.board.devices[0] &&
            !this.state.areSettingsOpen
          ) {
            if (this.props.devicesSearchText === "") {
              this.props.selectDevice(this.props.boardData.board.devices[0].id)
            } else {
              this.props.selectDevice(
                this.props.boardData.board.devices.filter(device =>
                  device.customName
                    .toLowerCase()
                    .includes(this.props.devicesSearchText.toLowerCase())
                )[0].id
              )
            }
            this.setState({ drawer: false })
          }
          if (this.state.areSettingsOpen) {
            this.setState({ slideIndex: 0 })
          }
        }
      },
    },
    "alt+2": {
      priority: 1,
      handler: event => {
        if (this.props.boardData.board) {
          if (
            this.props.boardData.board.devices[1] &&
            !this.state.areSettingsOpen
          ) {
            if (this.props.devicesSearchText !== "") {
              this.props.selectDevice(
                this.props.boardData.board.devices.filter(device =>
                  device.customName
                    .toLowerCase()
                    .includes(this.props.devicesSearchText.toLowerCase())
                )[1].id
              )
            } else {
              this.props.selectDevice(this.props.boardData.board.devices[1].id)
            }
            this.setState({ drawer: false })
          }
          if (this.state.areSettingsOpen) {
            this.setState({ slideIndex: 1 })
          }
        }
      },
    },
    "alt+3": {
      priority: 1,
      handler: event => {
        if (this.props.boardData.board) {
          if (
            this.props.boardData.board.devices[2] &&
            !this.state.areSettingsOpen
          ) {
            if (this.props.devicesSearchText !== "") {
              this.props.selectDevice(
                this.props.boardData.board.devices.filter(device =>
                  device.customName
                    .toLowerCase()
                    .includes(this.props.devicesSearchText.toLowerCase())
                )[2].id
              )
            } else {
              this.props.selectDevice(this.props.boardData.board.devices[2].id)
            }
            this.setState({ drawer: false })
          }
          if (this.state.areSettingsOpen) {
            this.setState({ slideIndex: 2 })
          }
        }
      },
    },
    "alt+4": {
      priority: 1,
      handler: event => {
        if (this.props.boardData.board) {
          if (
            this.props.boardData.board.devices[3] &&
            !this.state.areSettingsOpen
          ) {
            if (this.props.devicesSearchText !== "") {
              this.props.selectDevice(
                this.props.boardData.board.devices.filter(device =>
                  device.customName
                    .toLowerCase()
                    .includes(this.props.devicesSearchText.toLowerCase())
                )[3].id
              )
            } else {
              this.props.selectDevice(this.props.boardData.board.devices[3].id)
            }
            this.setState({ drawer: false })
          }
        }
      },
    },
    "alt+5": {
      priority: 1,
      handler: event => {
        if (this.props.boardData.board) {
          if (
            this.props.boardData.board.devices[4] &&
            !this.state.areSettingsOpen
          ) {
            if (this.props.devicesSearchText !== "") {
              this.props.selectDevice(
                this.props.boardData.board.devices.filter(device =>
                  device.customName
                    .toLowerCase()
                    .includes(this.props.devicesSearchText.toLowerCase())
                )[4].id
              )
            } else {
              this.props.selectDevice(this.props.boardData.board.devices[4].id)
            }
            this.setState({ drawer: false })
          }
        }
      },
    },
    "alt+6": {
      priority: 1,
      handler: event => {
        if (this.props.boardData.board) {
          if (
            this.props.boardData.board.devices[5] &&
            !this.state.areSettingsOpen
          ) {
            if (this.props.devicesSearchText !== "") {
              this.props.selectDevice(
                this.props.boardData.board.devices.filter(device =>
                  device.customName
                    .toLowerCase()
                    .includes(this.props.devicesSearchText.toLowerCase())
                )[5].id
              )
            } else {
              this.props.selectDevice(this.props.boardData.board.devices[5].id)
            }
            this.setState({ drawer: false })
          }
        }
      },
    },
    "alt+7": {
      priority: 1,
      handler: event => {
        if (this.props.boardData.board) {
          if (
            this.props.boardData.board.devices[6] &&
            !this.state.areSettingsOpen
          ) {
            if (this.props.devicesSearchText !== "") {
              this.props.selectDevice(
                this.props.boardData.board.devices.filter(device =>
                  device.customName
                    .toLowerCase()
                    .includes(this.props.devicesSearchText.toLowerCase())
                )[6].id
              )
            } else {
              this.props.selectDevice(this.props.boardData.board.devices[6].id)
            }
            this.setState({ drawer: false })
          }
        }
      },
    },
    "alt+8": {
      priority: 1,
      handler: event => {
        if (this.props.boardData.board) {
          if (
            this.props.boardData.board.devices[7] &&
            !this.state.areSettingsOpen
          ) {
            if (this.props.devicesSearchText !== "") {
              this.props.selectDevice(
                this.props.boardData.board.devices.filter(device =>
                  device.customName
                    .toLowerCase()
                    .includes(this.props.devicesSearchText.toLowerCase())
                )[7].id
              )
            } else {
              this.props.selectDevice(this.props.boardData.board.devices[7].id)
            }
            this.setState({ drawer: false })
          }
        }
      },
    },
    "alt+9": {
      priority: 1,
      handler: event => {
        if (this.props.boardData.board) {
          if (
            this.props.boardData.board.devices[8] &&
            !this.state.areSettingsOpen
          ) {
            if (this.props.devicesSearchText !== "") {
              this.props.selectDevice(
                this.props.boardData.board.devices.filter(device =>
                  device.customName
                    .toLowerCase()
                    .includes(this.props.devicesSearchText.toLowerCase())
                )[8].id
              )
            } else {
              this.props.selectDevice(this.props.boardData.board.devices[8].id)
            }
            this.setState({ drawer: false })
          }
        }
      },
    },
  }

  constructor() {
    super()

    this.state = {
      showHidden: false,
      areSettingsOpen: false,
      isTileFullScreen: false,
      drawer: false,
      copyMessageOpen: false,
    }
  }

  changeShowHiddenState = () =>
    this.setState(oldState => ({
      showMainHidden: !oldState.showMainHidden,
    }))

  showHiddenNotifications = () =>
    this.setState(oldState => ({
      hiddenNotifications: !oldState.hiddenNotifications,
    }))

  componentDidMount() {
    const deviceSubscriptionQuery = gql`
      subscription {
        deviceCreated {
          id
          index
          customName
          icon
          online
          batteryStatus
          batteryCharging
          signalStatus
          deviceType
          createdAt
          updatedAt
          notificationsCount
          notifications {
            id
            content
            visualized
          }
        }
      }
    `

    this.props.boardData.subscribeToMore({
      document: deviceSubscriptionQuery,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }
        const newDevices = [
          ...prev.board.devices,
          subscriptionData.data.deviceCreated,
        ]

        return {
          board: {
            ...prev.board,
            devices: newDevices,
          },
        }
      },
    })

    const subscribeToDevicesUpdates = gql`
      subscription {
        deviceUpdated {
          id
          myRole
          batteryStatus
          batteryCharging
          signalStatus
          owner {
            id
            email
            fullName
            profileIconColor
          }
          admins {
            id
            email
            fullName
            profileIconColor
          }
          editors {
            id
            email
            fullName
            profileIconColor
          }
          spectators {
            id
            email
            fullName
            profileIconColor
          }
        }
      }
    `

    this.props.boardData.subscribeToMore({
      document: subscribeToDevicesUpdates,
    })

    const subscribeToDevicesDeletes = gql`
      subscription {
        deviceDeleted
      }
    `

    this.props.boardData.subscribeToMore({
      document: subscribeToDevicesDeletes,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }

        const newDevices = prev.board.devices.filter(
          device => device.id !== subscriptionData.data.deviceDeleted
        )

        return {
          board: {
            ...prev.board,
            devices: newDevices,
          },
        }
      },
    })
  }

  render() {
    const {
      boardData: { board },
    } = this.props

    let nightMode = false
    let devMode = false
    let deviceIdList = []

    if (this.props.devMode) {
      devMode = this.props.devMode
    }

    nightMode =
      typeof Storage !== "undefined" &&
      localStorage.getItem("nightMode") === "true"

    if (board && this.props.boards) {
      let j

      for (j = 0; j < this.props.boards.length; j++) {
        deviceIdList = deviceIdList.concat(
          this.props.boards[j].devices.map(device => device.id)
        )
      }

      let boardIdList = this.props.boards.map(board => board.id)

      if (!queryString.parse("?" + window.location.href.split("?")[1]).device) {
        if (!boardIdList.includes(this.props.boardId))
          return <Redirect exact to="/dashboard" />
      }

      let i

      for (i = 0; i < board.devices.length; i++) {
        if (
          board.devices[i].id ===
            queryString.parse("?" + window.location.href.split("?")[1])
              .device &&
          board.id !==
            queryString.parse("?" + window.location.href.split("?")[1]).board
        ) {
          return (
            <Redirect
              to={
                "/dashboard?board=" +
                board.devices[i].board.id +
                "&device=" +
                board.devices[i].id
              }
            />
          )
        }
      }
    }

    let handleSettingsTabChanged = value => {
      this.setState({
        slideIndex: value,
      })
    }

    return (
      <React.Fragment>
        <Online>
          <Helmet>
            <title>
              {board &&
              queryString.parse("?" + window.location.href.split("?")[1]).device
                ? "Igloo Aurora - " +
                  board.devices.filter(
                    device =>
                      device.id ===
                      queryString.parse(
                        "?" + window.location.href.split("?")[1]
                      ).device
                  )[0].customName
                : "Igloo Aurora"}
            </title>
          </Helmet>
          <div className="main">
            <SettingsDialog
              isOpen={this.props.areSettingsOpen}
              closeSettingsDialog={this.props.closeSettings}
              handleChange={handleSettingsTabChanged}
              slideIndex={this.state.slideIndex}
              nightMode={nightMode}
              userData={this.props.userData}
            />
            <div className="invisibleHeader" key="invisibleHeader" />
            <SidebarHeader
              logOut={this.props.logOut}
              key="sidebarHeader"
              selectedBoard={this.props.boardId}
              openSettingsDialog={this.props.openSettings}
              changeSettingsState={() =>
                this.setState(oldState => ({
                  areSettingsOpen: !oldState.areSettingsOpen,
                  drawer: false,
                }))
              }
              boards={this.props.boards}
            />
            <div
              className="sidebar"
              key="sidebar"
              style={
                nightMode
                  ? { background: "#21252b" }
                  : { background: "#f2f2f2" }
              }
            >
              <Sidebar
                selectDevice={id => {
                  this.props.selectDevice(id)
                  this.setState({ drawer: false })
                }}
                selectedDevice={this.props.selectedDevice}
                changeDrawerState={this.changeDrawerState}
                boardData={this.props.boardData}
                nightMode={nightMode}
                selectedBoard={this.props.boardId}
                searchDevices={this.props.searchDevices}
                searchText={this.props.devicesSearchText}
              />
            </div>
            {this.props.selectedDevice !== null ? (
              <MainBodyHeader
                deviceId={this.props.selectedDevice}
                key="mainBodyHeader"
                drawer={this.state.drawer}
                changeDrawerState={this.changeDrawerState}
                hiddenNotifications={this.state.hiddenNotifications}
                showHiddenNotifications={this.showHiddenNotifications}
                nightMode={nightMode}
                devMode={devMode}
                openSnackBar={() => {
                  this.setState({ copyMessageOpen: true })
                }}
                boardData={this.props.boardData}
                boards={this.props.boards}
              />
            ) : (
              <div className="mainBodyHeader" key="mainBodyHeader" />
            )}
            {this.props.selectedDevice !== null ? (
              board ? (
                deviceIdList.includes(this.props.selectedDevice) ? (
                  <React.Fragment>
                    <MainBody
                      deviceId={this.props.selectedDevice}
                      showHidden={this.state.showMainHidden}
                      changeShowHiddenState={this.changeShowHiddenState}
                      nightMode={nightMode}
                      devMode={devMode}
                      boardData={this.props.boardData}
                      isMobile={false}
                      boards={this.props.boards}
                    />
                    <StatusBar
                      boardData={this.props.boardData}
                      deviceId={this.props.selectedDevice}
                      nightMode={nightMode}
                      isMobile={false}
                    />
                  </React.Fragment>
                ) : (
                  <Redirect
                    exact
                    to={
                      this.props.boardId
                        ? "/dashboard?board=" + this.props.boardId
                        : "/dashboard"
                    }
                  />
                )
              ) : (
                ""
              )
            ) : (
              <React.Fragment>
                <div
                  style={
                    typeof Storage !== "undefined" &&
                    localStorage.getItem("nightMode") === "true"
                      ? { background: "#2f333d" }
                      : { background: "white" }
                  }
                  className="mainBody"
                >
                  <div
                    className={
                      typeof Storage !== "undefined" &&
                      localStorage.getItem("nightMode") === "true"
                        ? "darkMainBodyBG"
                        : "mainBodyBG"
                    }
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
                <div
                  className="statusBar"
                  style={
                    typeof Storage !== "undefined" &&
                    localStorage.getItem("nightMode") === "true"
                      ? { background: "#2f333d" }
                      : { background: "white" }
                  }
                />
              </React.Fragment>
            )}
          </div>
        </Online>
        <Offline key="offlineMainBody">
          <div
            style={{
              width: "100vw",
              height: "100vh",
              backgroundColor: "#0057cb",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                margin: "auto",
                textAlign: "center",
                width: "400px",
              }}
            >
              <Typography variant="display1" style={{ color: "white" }}>
                You are not connected,
                <br />
                try again in a while
              </Typography>
              <br />
              <br />
              <br />
              <br />
              <img
                alt="Sleeping Polar Bear"
                src={polarBear}
                className="notSelectable"
              />
              <br />
              <br />
              <br />
              <br />
              <Typography
                variant="headline"
                gutterBottom
                style={{ color: "white" }}
              >
                In the meantime,
                <br />
                why don't you have a nap?
              </Typography>
            </div>
          </div>
        </Offline>
      </React.Fragment>
    )
  }
}

export default graphql(
  gql`
    query($id: ID!) {
      board(id: $id) {
        id
        devices {
          id
          index
          customName
          icon
          online
          batteryStatus
          batteryCharging
          signalStatus
          deviceType
          createdAt
          updatedAt
          notificationsCount
          notifications {
            id
            content
            visualized
          }
        }
      }
    }
  `,
  {
    name: "boardData",
    options: ({ boardId }) => ({ variables: { id: boardId } }),
  }
)(hotkeys(Main))
