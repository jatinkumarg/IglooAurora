import React from "react"
import IconButton from "material-ui/IconButton"
import IconMenu from "material-ui/IconMenu"
import CenteredSpinner from "./CenteredSpinner"
import { List, ListItem } from "material-ui/List"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Snackbar from "material-ui/Snackbar"

var moment = require("moment")

let notificationsCounter = 0

class NotificationsPopover extends React.Component {
  handleActionClick = () => {
    this.setState({
      snackOpen: false,
    })
  }

  countNotifications = () => {
    notificationsCounter++
  }

  render() {
    const { userData: { loading, error, user } } = this.props

    let notifications = "No notifications"

    let notificationsIcon = "notifications_none"

    var notificationsSnackBar = []

    if (error) notifications = "Unexpected error bear"

    if (loading) notifications = <CenteredSpinner />

    if (user) {
      notifications = (
        <List>
          {user.notifications.map(notification => (
            <ListItem
              className="notSelectable"
              primaryText={
                <span>
                  <b>{notification.device.customName}:</b>{" "}
                  {notification.content}
                </span>
              }
              secondaryText={moment(
                notification.date.split(".")[0],
                "YYYY-MM-DDTh:mm:ss"
              ).fromNow()}
              style={{
                backgroundColor: "transparent",
              }}
              leftIcon={
                notification.device.icon ? (
                  <img
                    className="deviceIcon"
                    src={notification.device.icon}
                    alt="device logo"
                  />
                ) : (
                  <i className="material-icons">lightbulb_outline</i>
                )
              }
            />
          ))}
        </List>
      )
      notificationsIcon = user.notifications
        ? "notifications"
        : "notifications_none"

      user.notifications.map(notification =>
        notificationsSnackBar.push(
          <span>
            <b>{notification.device.customName}:</b> {notification.content}
          </span>
        )
      )

      notificationsSnackBar.forEach(this.countNotifications)
    }

    return (
      <React.Fragment>
        <IconMenu
          iconButtonElement={
            <IconButton
              style={{
                padding: "0",
                marginRight: "4px",
                width: "24px",
                height: "24px",
              }}
              onClick={this.handleClick}
              className="sidebarHeaderButton"
              tooltip="Notifications"
            >
              <i className="material-icons sidebarHeaderIcons">
                {notificationsIcon}
              </i>
            </IconButton>
          }
          anchorOrigin={{ horizontal: "middle", vertical: "bottom" }}
          targetOrigin={{ horizontal: "middle", vertical: "top" }}
          menuStyle={{
            width: "300px",
            height: "50vh",
            minHeight: "350px",
          }}
          menutype="notifications"
        >
          <div className="notificationsTopBar notSelectable invisibleHeader">
            <IconButton className="notificationsLeftSide">
              <i className="material-icons">clear_all</i>
            </IconButton>
            <IconButton className="notificationsRightSide">
              <i className="material-icons">notifications_off</i>
            </IconButton>
          </div>
          <div className="notSelectable">{notifications}</div>
        </IconMenu>
        <Snackbar
          open={notificationsSnackBar[notificationsCounter - 1]}
          message={notificationsSnackBar[notificationsCounter - 1]}
          autoHideDuration={10000}
          action="Dismiss"
          onActionClick={this.handleActionClick}
        />
      </React.Fragment>
    )
  }
}

export default graphql(
  gql`
    query {
      user {
        notifications {
          id
          content
          date
          visualized
          device {
            id
            icon
            customName
          }
        }
      }
    }
  `,
  { name: "userData" }
)(NotificationsPopover)
