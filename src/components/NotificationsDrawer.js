import React from "react"
import CenteredSpinner from "./CenteredSpinner"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import AppBar from "@material-ui/core/AppBar"
import Typography from "@material-ui/core/Typography"
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
import Button from "@material-ui/core/Button"
import { hotkeys } from "react-keyboard-shortcuts"
import moment from "moment"
import Moment from "react-moment"
import NotificationsNone from "@material-ui/icons/NotificationsNone"
import Notifications from "@material-ui/icons/Notifications"
import Delete from "@material-ui/icons/Delete"
import MoreVert from "@material-ui/icons/MoreVert"
import KeyboardArrowUp from "@material-ui/icons/KeyboardArrowUp"
import KeyboardArrowDown from "@material-ui/icons/KeyboardArrowDown"
import Markunread from "@material-ui/icons/Markunread"
import ChevronRight from "@material-ui/icons/ChevronRight"

let device

let loading

let error

let unreadNotifications = []

let notificationsToFlush = []

class NotificationsDrawer extends React.Component {
  state = { showread: false }
  hot_keys = {
    "alt+n": {
      priority: 1,
      handler: event => {
        this.props.changeDrawerState()
      },
    },
  }

  componentDidMount() {
    this.props.notifications.refetch()

    const subscriptionQuery = gql`
      subscription {
        notificationCreated {
          id
          content
          date
          read
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
          read
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
        const newNotification = [
          ...prev.user.notifications,
          subscriptionData.data.notificationUpdated,
        ]

        return {
          user: {
            ...prev.user,
            notifications: newNotification,
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

  clearNotification = id => {
    this.props.ClearNotification({
      variables: {
        id: id,
      },
    })
  }

  clearAllNotifications = () => {
    if (device) {
      notificationsToFlush = device.notifications
        .filter(
          notification =>
            notification.read === false &&
            unreadNotifications.indexOf(notification.id) === -1
        )
        .map(notification => notification.id)

      for (let i = 0; i < notificationsToFlush.length; i++) {
        this.clearNotification(notificationsToFlush[i])
      }
    }
  }

  showNotificationsAsRead = () => {
    if (device) {
      device.notifications
        .filter(notification => !unreadNotifications.includes(notification.id))
        .forEach(notification =>
          Object.defineProperty(notification, "read", {
            value: true,
            writable: true,
            configurable: true,
          })
        )
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.drawer !== nextProps.drawer && nextProps.drawer) {
      unreadNotifications = []

      this.clearAllNotifications()
    }

    if (this.props.notifications.error !== nextProps.notifications.error) {
      error = nextProps.notifications.error
    }

    if (this.props.notifications.loading !== nextProps.notifications.loading) {
      loading = nextProps.notifications.loading
    }

    if (this.props.notifications.device !== nextProps.notifications.device) {
      device = nextProps.notifications.device
    }
  }

  render() {
    let markAsUnread = id => {
      this.props.MarkAsUnread({
        variables: {
          id: id,
        },
        optimisticResponse: {
          __typename: "Mutation",
          notification: {
            id: id,
            read: false,
            __typename: "Notification",
          },
        },
      })
    }

    let deleteNotification = id => {
      this.props.DeleteNotification({
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

    let notifications = ""
    let readNotifications = ""

    let notificationCount = ""

    let noNotificationsUI = ""
    let readNotificationsUI = ""

    if (error) {
      notifications = "Unexpected error"

      if (error.message === "GraphQL error: This user doesn't exist anymore") {
        this.props.logOut(true)
      }
    }

    if (loading || !this.props.completeDevice)
      notifications = (
        <CenteredSpinner
          style={{
            paddingTop: "32px",
          }}
        />
      )

    if (device && this.props.completeDevice) {
      let determineDiff = notification =>
        moment().isSame(
          moment.utc(notification.date.split(".")[0], "YYYY-MM-DDTh:mm:ss"),
          "day"
        )
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
        .filter(notification => !notification.read)
        .map(notification => determineDiff(notification))
        .reverse()

      let cleanedNotificationsSections = removeDuplicates(notificationsSections)

      notifications = (
        <List
          style={{
            padding: "0",
          }}
        >
          {cleanedNotificationsSections.map(section => (
            <li>
              <ListSubheader
                style={
                  typeof Storage !== "undefined" &&
                  localStorage.getItem("nightMode") === "true"
                    ? { backgroundColor: "#2f333d" }
                    : { backgroundColor: "white" }
                }
              >
                <font
                  style={
                    typeof Storage !== "undefined" &&
                    localStorage.getItem("nightMode") === "true"
                      ? { color: "#c1c2c5" }
                      : { color: "#7a7a7a" }
                  }
                >
                  {section}
                </font>
              </ListSubheader>
              {device.notifications &&
                device.notifications
                  .filter(
                    notification => determineDiff(notification) === section
                  )
                  .filter(notification => !notification.read)
                  .map(notification => (
                    <ListItem
                      className="notSelectable"
                      key={notification.id}
                      id={notification.id}
                    >
                      <ListItemText
                        primary={
                          <font
                            style={
                              typeof Storage !== "undefined" &&
                              localStorage.getItem("nightMode") === "true"
                                ? { color: "white" }
                                : { color: "black" }
                            }
                          >
                            {notification.content}
                          </font>
                        }
                        secondary={
                          <font
                            style={
                              typeof Storage !== "undefined" &&
                              localStorage.getItem("nightMode") === "true"
                                ? { color: "#c1c2c5" }
                                : { color: "#7a7a7a" }
                            }
                          >
                            <Moment fromNow>
                              {moment.utc(
                                notification.date.split(".")[0],
                                "YYYY-MM-DDTh:mm:ss"
                              )}
                            </Moment>
                          </font>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Tooltip title="Delete" placement="bottom">
                          <IconButton
                            onClick={() => deleteNotification(notification.id)}
                            style={
                              typeof Storage !== "undefined" &&
                              localStorage.getItem("nightMode") === "true"
                                ? { color: "white" }
                                : { color: "black" }
                            }
                          >
                            <Delete />
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

      let readNotificationsSections = device.notifications
        .filter(notification => notification.read)
        .map(notification => determineDiff(notification))
        .reverse()

      let cleanedReadNotificationsSections = removeDuplicates(
        readNotificationsSections
      )

      readNotifications = (
        <List
          style={{
            padding: "0",
          }}
        >
          {cleanedReadNotificationsSections.map(section => (
            <li>
              <ListSubheader
                style={
                  typeof Storage !== "undefined" &&
                  localStorage.getItem("nightMode") === "true"
                    ? { backgroundColor: "#2f333d" }
                    : { backgroundColor: "white" }
                }
              >
                <font
                  style={
                    typeof Storage !== "undefined" &&
                    localStorage.getItem("nightMode") === "true"
                      ? { color: "#c1c2c5" }
                      : { color: "#7a7a7a" }
                  }
                >
                  {section}
                </font>
              </ListSubheader>
              {device.notifications &&
                device.notifications
                  .filter(
                    notification => determineDiff(notification) === section
                  )
                  .filter(notification => notification.read)
                  .map(notification => (
                    <ListItem
                      key={notification.id}
                      className="notSelectable"
                      id={notification.id}
                    >
                      <ListItemText
                        primary={
                          <font
                            style={
                              typeof Storage !== "undefined" &&
                              localStorage.getItem("nightMode") === "true"
                                ? { color: "white" }
                                : { color: "black" }
                            }
                          >
                            {notification.content}
                          </font>
                        }
                        secondary={
                          <font
                            style={
                              typeof Storage !== "undefined" &&
                              localStorage.getItem("nightMode") === "true"
                                ? { color: "#c1c2c5" }
                                : { color: "#7a7a7a" }
                            }
                          >
                            <Moment fromNow>
                              {moment.utc(
                                notification.date.split(".")[0],
                                "YYYY-MM-DDTh:mm:ss"
                              )}
                            </Moment>
                          </font>
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
                            style={
                              typeof Storage !== "undefined" &&
                              localStorage.getItem("nightMode") === "true"
                                ? { color: "white" }
                                : { color: "black" }
                            }
                          >
                            <MoreVert />
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
        device.notifications.filter(notification => notification.read === false)
          .length

      const readNotificationCount =
        device.notifications &&
        device.notifications.filter(notification => notification.read === true)
          .length

      if (!notificationCount) {
        noNotificationsUI = (
          <Typography
            variant="h5"
            style={
              typeof Storage !== "undefined" &&
              localStorage.getItem("nightMode") === "true"
                ? {
                    textAlign: "center",
                    marginTop: "32px",
                    marginBottom: "32px",
                    color: "white",
                  }
                : {
                    textAlign: "center",
                    marginTop: "32px",
                    marginBottom: "32px",
                  }
            }
          >
            No new notifications
          </Typography>
        )
      }

      if (readNotificationCount) {
        readNotificationsUI = (
          <Button
            onClick={() => this.props.showHiddenNotifications()}
            fullWidth={true}
            className="divider"
            key="showMoreLessButton"
            style={
              this.props.hiddenNotifications
                ? typeof Storage !== "undefined" &&
                  localStorage.getItem("nightMode") === "true"
                  ? { backgroundColor: "#282c34", color: "white" }
                  : { backgroundColor: "#d4d4d4", color: "black" }
                : typeof Storage !== "undefined" &&
                  localStorage.getItem("nightMode") === "true"
                ? { backgroundColor: "transparent", color: "white" }
                : { backgroundColor: "transparent", color: "black" }
            }
          >
            {this.props.hiddenNotifications ? (
              <KeyboardArrowUp />
            ) : (
              <KeyboardArrowDown />
            )}
            {this.props.hiddenNotifications
              ? "Hide read notifications"
              : "Show read notifications"}
          </Button>
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
              <Markunread />
            </ListItemIcon>
            <ListItemText>
              <font
                style={
                  typeof Storage !== "undefined" &&
                  localStorage.getItem("nightMode") === "true"
                    ? { color: "white" }
                    : { color: "black" }
                }
              >
                Mark as unread
              </font>
            </ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              deleteNotification(this.state.targetNotification.id)
              this.setState({ anchorEl: null })
            }}
          >
            <ListItemIcon>
              <Delete style={{ color: "#f44336" }} />
            </ListItemIcon>
            <ListItemText inset>
              <font style={{ color: "#f44336" }}>Delete</font>
            </ListItemText>
          </MenuItem>
        </Menu>
        <Tooltip title="Notifications" placement="bottom">
          <IconButton
            style={{ color: "white" }}
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
          >
            <Badge
              badgeContent={notificationCount}
              color="primary"
              invisible={!notificationCount}
            >
              {notificationCount ? <Notifications /> : <NotificationsNone />}
            </Badge>
          </IconButton>
        </Tooltip>
        <SwipeableDrawer
          variant="temporary"
          anchor="right"
          open={this.props.drawer}
          onClose={() => {
            notificationsToFlush = []
            this.props.changeDrawerState()
            this.showNotificationsAsRead()
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
                  style={
                    this.props.isMobile
                      ? {
                          height: "64px",
                          backgroundColor: "#0057cb",
                          display: "flex",
                          alignItems: "center",
                        }
                      : {
                          height: "64px",
                          backgroundColor: "#0083ff",
                          display: "flex",
                          alignItems: "center",
                        }
                  }
                >
                  <Tooltip
                    id="tooltip-bottom"
                    title="Close drawer"
                    placement="bottom"
                  >
                    <IconButton
                      onClick={() => {
                        this.props.changeDrawerState()
                      }}
                      style={{
                        color: "white",
                        marginTop: "auto",
                        marginBottom: "auto",
                        marginLeft: "8px",
                      }}
                    >
                      <ChevronRight />
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
          read
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
        notification(id: $id, read: true) {
          id
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
          notification(id: $id, read: false) {
            id
            read
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
            mutation ToggleQuietMode($id: ID!, $muted: Boolean!) {
              device(id: $id, muted: $muted) {
                id
                muted
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
