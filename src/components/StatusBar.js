import React, { Component } from "react"
import Icon from "material-ui-next/Icon"
import gql from "graphql-tag"

export default class StatusBar extends Component {
  componentDidMount() {
    const subscriptionQuery = gql`
      subscription {
        deviceUpdated {
          id
          customName
          icon
          online
          notifications {
            id
            content
            date
            visualized
          }
        }
      }
    `

    this.props.userData.subscribeToMore({
      document: subscriptionQuery,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }
        const newDevices = [
          ...prev.user.devices,
          subscriptionData.data.deviceCreated,
        ]
        return {
          user: {
            ...prev.user,
            devices: newDevices,
          },
        }
      },
    })
  }

  render() {
    const {
      userData: { loading, error, user },
    } = this.props

    let deviceStatus = ""

    if (error) deviceStatus = "Unexpected error"

    if (loading) deviceStatus =""

    if (
      user &&
      user.devices.filter(device => device.id === this.props.deviceId)[0]
    ) {
      deviceStatus = user.devices.filter(
        device => device.id === this.props.deviceId
      )[0].online
        ? "Online"
        : "Last seen:"
    }

    return (
      <div
        style={
          this.props.nightMode
            ? { background: "#2f333d", color: "white" }
            : { background: "white", color: "black" }
        }
        className="notSelectable statusBar defaultCursor"
      >
        <div style={{ marginLeft: "16px" }}>
          {deviceStatus}
          <div
            style={{
              float: "right",
              marginRight: "8px",
            }}
          >
            <Icon>network_wifi</Icon> <Icon>battery_full</Icon>
          </div>
        </div>
      </div>
    )
  }
}
