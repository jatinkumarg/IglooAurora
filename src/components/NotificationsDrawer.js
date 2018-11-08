import React from "react"
import CenteredSpinner from "./CenteredSpinner"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import AppBar from "@material-ui/core/AppBar"
import Typography from "@material-ui/core/Typography"
import Icon from "@material-ui/core/Icon"
import Badge from "@material-ui/core/Badge"
import Tooltip from "@material-ui/core/Tooltip"
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer"
import IconButton from "@material-ui/core/IconButton"
import MenuItem from "@material-ui/core/MenuItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListSubheader from "@material-ui/core/ListSubheader"
import Menu from "@material-ui/core/Menu"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import FlatButton from "material-ui/FlatButton"
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider"
import createMuiTheme from "@material-ui/core/styles/createMuiTheme"
import { hotkeys } from "react-keyboard-shortcuts"
import moment from "moment"
import Moment from "react-moment"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#ff4081" },
    secondary: { main: "#ffffff" },
  },
})

const sleep = time =>
  new Promise((resolve, reject) => {
    setTimeout(() => resolve(), time)
  })

let unreadNotifications = []

class NotificationsDrawer extends React.Component {
  state = { showVisualized: false }
  hot_keys = {
    "alt+n": {
      priority: 1,
      handler: event => {
        this.props.changeDrawerState()
      },
    },
  }

  componentDidMount() {
    const subscriptionQuery = gql`
      subscription {
        notificationCreated {
          id
          content
          date
          visualized
          device {
            id
          }
        }
      }
    `

    this.props.notifications.subscribeToMore({
      document: subscriptionQuery,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }
        const newNotifications = [
          ...prev.device.notifications,
          subscriptionData.data.notificationCreated,
        ]
        return {
          device: {
            ...prev.device,
            notifications: newNotifications,
          },
        }
      },
    })

    const updateQuery = gql`
      subscription {
        notificationUpdated {
          id
          content
          date
          visualized
          device {
            id
          }
        }
      }
    `

    this.props.notifications.subscribeToMore({
      document: updateQuery,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }
        const newNotification = subscriptionData.data.notificationUpdated

        const newNotifications = prev.device.notifications.map(notification =>
          notification.id === newNotification.id
            ? newNotification
            : notification
        )
        return {
          device: {
            ...prev.device,
            notifications: newNotifications,
          },
        }
      },
    })

    const subscribeToNotificationsDeletes = gql`
      subscription {
        notificationDeleted
      }
    `

    this.props.notifications.subscribeToMore({
      document: subscribeToNotificationsDeletes,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }

        const newNotifications = prev.device.notifications.filter(
          notification =>
            notification.id !== subscriptionData.data.notificationDeleted
        )

        return {
          device: {
            ...prev.device,
            notifications: newNotifications,
          },
        }
      },
    })
  }

  render() {
    const {
      notifications: { loading, error, device },
    } = this.props

    let clearNotification = id => {
      this.props["ClearNotification"]({
        variables: {
          id: id,
        },
        optimisticResponse: {
          __typename: "Mutation",
          notification: {
            id: id,
            visualized: true,
            __typename: "Notification",
          },
        },
      })
    }

    let markAsUnread = id => {
      this.props["MarkAsUnread"]({
        variables: {
          id: id,
        },
        optimisticResponse: {
          __typename: "Mutation",
          notification: {
            id: id,
            visualized: false,
            __typename: "Notification",
          },
        },
      })
    }

    let deleteNotification = id => {
      this.props["DeleteNotification"]({
        variables: {
          id: id,
        },
        optimisticResponse: {
          __typename: "Mutation",
          deleteNotification: {
            id: id,
            __typename: "Notification",
          },
        },
      })
    }

    let clearAllNotifications = () => {
      const notificationsToFlush = device.notifications.filter(
        notification =>
          notification.visualized === false &&
          unreadNotifications.indexOf(notification.id) === -1
      )

      for (let i = 0; i < notificationsToFlush.length; i++) {
        clearNotification(notificationsToFlush[i].id)
      }
    }

    let notifications = ""
    let readNotifications = ""

    let notificationCount = ""

    let noNotificationsUI = ""
    let readNotificationsUI = ""

    if (error) notifications = "Unexpected error"

    if (loading || !this.props.completeDevice)
      notifications = <CenteredSpinner />

    if (device && this.props.completeDevice) {
      let determineDiff = notification =>
        moment()
          .endOf("day")
          .diff(
            moment
              .utc(notification.date.split(".")[0], "YYYY-MM-DDTh:mm:ss")
              .endOf("day"),
            "days"
          ) <= 0
          ? "Today"
          : moment()
              .endOf("week")
              .diff(
                moment
                  .utc(notification.date.split(".")[0], "YYYY-MM-DDTh:mm:ss")
                  .endOf("week"),
                "weeks"
              ) <= 1
          ? "This week"
          : moment()
              .endOf("month")
              .diff(
                moment
                  .utc(notification.date.split(".")[0], "YYYY-MM-DDTh:mm:ss")
                  .endOf("month"),
                "months"
              ) <= 0
          ? moment()
              .endOf("week")
              .add(1, "weeks")
              .diff(
                moment
                  .utc(notification.date.split(".")[0], "YYYY-MM-DDTh:mm:ss")
                  .endOf("week"),
                "weeks"
              ) + " weeks ago"
          : moment()
              .endOf("year")
              .diff(
                moment
                  .utc(notification.date.split(".")[0], "YYYY-MM-DDTh:mm:ss")
                  .endOf("year"),
                "years"
              ) <= 0
          ? moment()
              .endOf("month")
              .add(1, "months")
              .diff(
                moment
                  .utc(notification.date.split(".")[0], "YYYY-MM-DDTh:mm:ss")
                  .endOf("month"),
                "months"
              ) + " months ago"
          : moment()
              .endOf("year")
              .add(1, "years")
              .diff(
                moment
                  .utc(notification.date.split(".")[0], "YYYY-MM-DDTh:mm:ss")
                  .endOf("year"),
                "years"
              ) + " years ago"

      let removeDuplicates = inputArray => {
        var obj = {}
        var returnArray = []
        for (var i = 0; i < inputArray.length; i++) {
          obj[inputArray[i]] = true
        }
        for (var key in obj) {
          returnArray.push(key)
        }
        return returnArray
      }

      let notificationsSections = device.notifications
        .filter(notification => !notification.visualized)
        .map(notification => determineDiff(notification))
        .reverse()

      let cleanedNotificationsSections = removeDuplicates(notificationsSections)

      notifications = (
        <List style={{ padding: "0" }}>
          {cleanedNotificationsSections.map(section => (
            <li>
              <ListSubheader style={{ backgroundColor: "white" }}>
                {section}
              </ListSubheader>
              {device.notifications &&
                device.notifications
                  .filter(
                    notification => determineDiff(notification) === section
                  )
                  .filter(notification => !notification.visualized)
                  .map(notification => (
                    <ListItem
                      className="notSelectable"
                      key={notification.id}
                      id={notification.id}
                      onClick={() => clearNotification(notification.id)}
                      button
                    >
                      <ListItemText
                        primary={notification.content}
                        secondary={
                          <Moment fromNow>
                            {moment.utc(
                              notification.date.split(".")[0],
                              "YYYY-MM-DDTh:mm:ss"
                            )}
                          </Moment>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <i class="material-icons">delete</i>
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))
                  .reverse()}
            </li>
          ))}
        </List>
      )

      let readNotificationsSections = device.notifications
        .filter(notification => notification.visualized)
        .map(notification => determineDiff(notification))
        .reverse()

      let cleanedReadNotificationsSections = removeDuplicates(
        readNotificationsSections
      )

      readNotifications = (
        <List style={{ padding: "0" }}>
          {cleanedReadNotificationsSections.map(section => (
            <li>
              <ListSubheader style={{ backgroundColor: "white" }}>
                {section}
              </ListSubheader>
              {device.notifications &&
                device.notifications
                  .filter(
                    notification => determineDiff(notification) === section
                  )
                  .filter(notification => notification.visualized)
                  .map(notification => (
                    <ListItem
                      key={notification.id}
                      className="notSelectable"
                      id={notification.id}
                    >
                      <ListItemText
                        primary={notification.content}
                        secondary={
                          <Moment fromNow>
                            {moment.utc(
                              notification.date.split(".")[0],
                              "YYYY-MM-DDTh:mm:ss"
                            )}
                          </Moment>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Tooltip title="More" placement="bottom">
                          <IconButton
                            onClick={event =>
                              this.setState({
                                anchorEl: event.currentTarget,
                                targetNotification: notification,
                              })
                            }
                          >
                            <i class="material-icons">more_vert</i>
                          </IconButton>
                        </Tooltip>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))
                  .reverse()}
            </li>
          ))}
        </List>
      )

      notificationCount =
        device.notifications &&
        device.notifications.filter(
          notification => notification.visualized === false
        ).length

      const readNotificationCount =
        device.notifications &&
        device.notifications.filter(
          notification => notification.visualized === true
        ).length

      if (!notificationCount) {
        noNotificationsUI = (
          <Typography
            variant="headline"
            style={{
              textAlign: "center",
              marginTop: "32px",
              marginBottom: "32px",
            }}
          >
            No new notifications
          </Typography>
        )
      }

      if (readNotificationCount) {
        readNotificationsUI = (
          <FlatButton
            onClick={() => this.props.showHiddenNotifications()}
            label={
              this.props.hiddenNotifications
                ? "Hide read notifications"
                : "Show read notifications"
            }
            icon={
              this.props.hiddenNotifications ? (
                <Icon>keyboard_arrow_up</Icon>
              ) : (
                <Icon>keyboard_arrow_down</Icon>
              )
            }
            fullWidth={true}
            className="divider"
            key="showMoreLessButton"
            style={
              this.props.hiddenNotifications
                ? typeof Storage !== "undefined" &&
                  localStorage.getItem("nightMode") === "true"
                  ? { backgroundColor: "#282c34" }
                  : { backgroundColor: "#d4d4d4" }
                : null
            }
          />
        )
      }
    }

    return (
      <React.Fragment>
        <Menu
          open={this.state.anchorEl}
          anchorEl={this.state.anchorEl}
          onClose={() => {
            this.setState({ anchorEl: null })
          }}
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
            onClick={() => {
              markAsUnread(this.state.targetNotification.id)
              this.setState({ anchorEl: null })
              unreadNotifications.push(this.state.targetNotification.id)
            }}
          >
            <ListItemIcon>
              <Icon
                style={
                  typeof Storage !== "undefined" &&
                  localStorage.getItem("nightMode") === "true"
                    ? { color: "white" }
                    : { color: "black" }
                }
              >
                markunread
              </Icon>
            </ListItemIcon>
            <ListItemText>Mark as unread</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              deleteNotification(this.state.targetNotification.id)
              this.setState({ anchorEl: null })
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
        <MuiThemeProvider theme={theme}>
          <Tooltip title="Notifications" placement="bottom">
            <IconButton
              color="secondary"
              style={this.props.isMobile ? { marginTop: "8px" } : {}}
              onClick={
                this.props.hiddenNotifications
                  ? () => {
                      this.props.changeDrawerState()
                      this.props.showHiddenNotifications()
                    }
                  : () => {
                      this.props.changeDrawerState()
                    }
              }
              disabled={!this.props.completeDevice}
            >
              {notificationCount ? (
                <Badge badgeContent={notificationCount} color="primary">
                  <Icon>notifications</Icon>
                </Badge>
              ) : (
                <Icon>notifications_none</Icon>
              )}
            </IconButton>
          </Tooltip>
        </MuiThemeProvider>
        <SwipeableDrawer
          variant="temporary"
          anchor="right"
          open={this.props.drawer}
          onClose={async time => {
            this.props.changeDrawerState()
            await sleep(200)
            clearAllNotifications()
          }}
          swipeAreaWidth={0}
          disableBackdropTransition={false}
          disableDiscovery={true}
        >
          <div
            style={
              typeof Storage !== "undefined" &&
              localStorage.getItem("nightMode") === "true"
                ? { background: "#2f333d", height: "100%", overflowY: "hidden" }
                : { background: "white", height: "100%", overflowY: "hidden" }
            }
          >
            <div>
              <AppBar position="sticky" style={{ height: "64px" }}>
                <div
                  className="notSelectable"
                  style={{
                    height: "64px",
                    backgroundColor: "#0083ff",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Tooltip
                    id="tooltip-bottom"
                    title="Close drawer"
                    placement="bottom"
                  >
                    <IconButton
                      onClick={() => {
                        this.props.changeDrawerState()
                        clearAllNotifications()
                      }}
                      style={{
                        color: "white",
                        marginTop: "auto",
                        marginBottom: "auto",
                        marginLeft: "8px",
                      }}
                    >
                      <Icon>chevron_right</Icon>
                    </IconButton>
                  </Tooltip>
                </div>
              </AppBar>
              <div
                className="notSelectable"
                style={
                  window.innerWidth > 360
                    ? {
                        overflowY: "auto",
                        height: "calc(100vh - 64px)",
                        width: "324px",
                      }
                    : {
                        overflowY: "auto",
                        height: "calc(100vh - 64px)",
                        width: "90vw",
                      }
                }
              >
                {noNotificationsUI}
                {notifications}
                {readNotificationsUI}
                {readNotificationsUI
                  ? this.props.hiddenNotifications
                    ? readNotifications
                    : ""
                  : ""}
              </div>
            </div>
          </div>
        </SwipeableDrawer>
      </React.Fragment>
    )
  }
}

export default graphql(
  gql`
    query($id: ID!) {
      device(id: $id) {
        id
        notifications {
          id
          content
          date
          visualized
          device {
            id
          }
        }
      }
    }
  `,
  {
    name: "notifications",
    options: ({ deviceId }) => ({ variables: { id: deviceId } }),
  }
)(
  graphql(
    gql`
      mutation ClearNotification($id: ID!) {
        notification(id: $id, visualized: true) {
          id
          visualized
        }
      }
    `,
    {
      name: "ClearNotification",
    }
  )(
    graphql(
      gql`
        mutation MarkAsUnread($id: ID!) {
          notification(id: $id, visualized: false) {
            id
            visualized
          }
        }
      `,
      {
        name: "MarkAsUnread",
      }
    )(
      graphql(
        gql`
          mutation DeleteNotification($id: ID!) {
            deleteNotification(id: $id)
          }
        `,
        {
          name: "DeleteNotification",
        }
      )(
        graphql(
          gql`
            mutation ToggleQuietMode($id: ID!, $quietMode: Boolean!) {
              device(id: $id, quietMode: $quietMode) {
                id
                quietMode
              }
            }
          `,
          {
            name: "ToggleQuietMode",
          }
        )(hotkeys(NotificationsDrawer))
      )
    )
  )
)
