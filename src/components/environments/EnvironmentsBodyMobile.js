import React, { Component } from "react"
import Typography from "@material-ui/core/Typography"
import Icon from "@material-ui/core/Icon"
import Grid from "@material-ui/core/Grid"
import AppBar from "@material-ui/core/AppBar"
import Paper from "@material-ui/core/Paper"
import BottomNavigation from "@material-ui/core/BottomNavigation"
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction"
import IconButton from "@material-ui/core/IconButton"
import Input from "@material-ui/core/Input"
import InputAdornment from "@material-ui/core/InputAdornment"
import FormControl from "@material-ui/core/FormControl"
import CenteredSpinner from "../CenteredSpinner"
import EnvironmentCard from "./EnvironmentCard"
import CreateEnvironment from "./CreateEnvironment"
import SwipeableViews from "react-swipeable-views"
import Helmet from "react-helmet"
import PendingShares from "./PendingShares"

class EnvironmentsBodyMobile extends Component {
  state = {
    anchorEl: null,
    createOpen: false,
    copyMessageOpen: false,
    slideIndex: 0,
    searchText: "",
  }

  handleSettingsTabChanged = (event, value) => {
    this.setState({
      slideIndex: value,
    })
  }

  render() {
    const {
      userData: { error, user, loading },
    } = this.props

    let environmentsList = ""
    let yourEnvironmentsList = ""

    let nightMode = false

    let devMode =
      typeof Storage !== "undefined" &&
      localStorage.getItem("devMode") === "true"

    if (loading) {
      yourEnvironmentsList = <CenteredSpinner />
    }

    if (error) {
      yourEnvironmentsList = "Unexpected error"
    }

    nightMode =
      typeof Storage !== "undefined" &&
      localStorage.getItem("nightMode") === "true"

    if (user) {
      yourEnvironmentsList = user.environments
        .filter(environment => environment.myRole === "OWNER")
        .filter(environment =>
          environment.name
            .toLowerCase()
            .includes(this.props.searchText.toLowerCase())
        )
        .map(environment => (
          <Grid key={environment.id} item>
            <EnvironmentCard
              userData={this.props.userData}
              environment={environment}
              nightMode={nightMode}
              devMode={devMode}
              showMessage={() => this.setState({ copyMessageOpen: true })}
              lastEnvironment={!user.environments[1]}
              client={this.props.client}
            />
          </Grid>
        ))

      environmentsList = user.environments
        .filter(environment => environment.myRole !== "OWNER")
        .filter(environment =>
          environment.name
            .toLowerCase()
            .includes(this.props.searchText.toLowerCase())
        )
        .map(environment => (
          <Grid key={environment.id} item>
            <EnvironmentCard
              userData={this.props.userData}
              environment={environment}
              nightMode={nightMode}
              devMode={devMode}
              showMessage={() => this.setState({ copyMessageOpen: true })}
              lastEnvironment={!user.environments[1]}
              client={this.props.client}
            />
          </Grid>
        ))
    }

    return (
      <React.Fragment>
        <Helmet>
          <title>Igloo Aurora</title>
        </Helmet>
        <div
          style={
            nightMode
              ? (environmentsList[0] ||
                  (user && user.pendingEnvironmentShares[0])) &&
                yourEnvironmentsList[0]
                ? {
                    width: "100vw",
                    height: "calc(100vh - 128px)",
                    backgroundColor: "#21252b",
                  }
                : {
                    width: "100vw",
                    height: "calc(100vh - 64px)",
                    backgroundColor: "#21252b",
                  }
              : (environmentsList[0] ||
                  (user && user.pendingEnvironmentShares[0])) &&
                yourEnvironmentsList[0]
              ? {
                  width: "100vw",
                  height: "calc(100vh - 128px)",
                  backgroundColor: "#f2f2f2",
                }
              : {
                  width: "100vw",
                  height: "calc(100vh - 64px)",
                  backgroundColor: "#f2f2f2",
                }
          }
        >
          <div
            style={{
              width: "100%",
              height: "64px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FormControl
              style={{
                marginTop: "16px",
                width: "calc(100% - 32px)",
                maxWidth: "400px",
              }}
            >
              <Input
                id="adornment-name-login"
                placeholder="Search environments"
                color="primary"
                className="notSelectable"
                value={this.props.searchText}
                style={nightMode ? { color: "white" } : { color: "black" }}
                onChange={event =>
                  this.props.searchEnvironments(event.target.value)
                }
                disabled={loading || error || (user && !user.environments[0])}
                startAdornment={
                  <InputAdornment
                    position="start"
                    style={{ cursor: "default" }}
                  >
                    <Icon
                      style={
                        nightMode
                          ? user && user.environments[0]
                            ? { color: "white" }
                            : { color: "white", opacity: "0.5" }
                          : user && user.environments[0]
                          ? { color: "black" }
                          : { color: "black", opacity: "0.5" }
                      }
                    >
                      search
                    </Icon>
                  </InputAdornment>
                }
                endAdornment={
                  this.props.searchText ? (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => this.props.searchEnvironments("")}
                        onMouseDown={this.handleMouseDownSearch}
                        style={
                          nightMode ? { color: "white" } : { color: "black" }
                        }
                      >
                        <Icon>clear</Icon>
                      </IconButton>
                    </InputAdornment>
                  ) : null
                }
              />
            </FormControl>
          </div>
          {error && "Unexpected error"}
          {loading && (
            <div
              style={{
                overflowY: "auto",
                height: "calc(100vh - 128px)",
              }}
            >
              <CenteredSpinner style={{ paddingTop: "32px" }} />
            </div>
          )}
          {user &&
            (environmentsList[0] || user.pendingEnvironmentShares[0] ? (
              <SwipeableViews
                index={this.state.slideIndex}
                onChangeIndex={slideIndex => this.setState({ slideIndex })}
              >
                <div
                  style={
                    nightMode
                      ? {
                          overflowY: "auto",
                          height: "calc(100vh - 192px)",
                          background: "#21252b",
                        }
                      : {
                          overflowY: "auto",
                          height: "calc(100vh - 192px)",
                          background: "#f2f2f2",
                        }
                  }
                >
                  <Typography
                    variant="h4"
                    className="notSelectable defaultCursor"
                    style={
                      nightMode
                        ? {
                            textAlign: "center",
                            paddingTop: "8px",
                            marginBottom: "16px",
                            color: "white",
                          }
                        : {
                            textAlign: "center",
                            paddingTop: "8px",
                            marginBottom: "16px",
                            color: "black",
                          }
                    }
                  >
                    Your environments
                  </Typography>
                  <div
                    style={{ height: "calc(100vh - 257px)", overflowY: "auto" }}
                  >
                    <Grid
                      container
                      justify="center"
                      spacing={16}
                      className="notSelectable defaultCursor"
                      style={{
                        width: "calc(100vw - 64px)",
                        marginLeft: "32px",
                        marginRight: "32px",
                      }}
                    >
                      {yourEnvironmentsList}
                      {user.pendingOwnerChanges[0] && (
                        <Grid key="environmentShares" item>
                          <Paper
                            style={
                              typeof Storage !== "undefined" &&
                              localStorage.getItem("nightMode") === "true"
                                ? {
                                    backgroundColor: "#2f333d",
                                    width: "256px",
                                    height: "192px",
                                    cursor: "pointer",
                                    textAlign: "center",
                                    color: "white",
                                  }
                                : {
                                    backgroundColor: "#fff",
                                    width: "256px",
                                    height: "192px",
                                    cursor: "pointer",
                                    textAlign: "center",
                                  }
                            }
                            onClick={() =>
                              this.setState({ pendingOwnerChangesOpen: true })
                            }
                          >
                            <div
                              style={{
                                paddingTop: "50px",
                                paddingBottom: "50px",
                              }}
                            >
                              <Icon style={{ fontSize: "64px" }}>people</Icon>
                              <br />
                              <Typography
                                variant="h5"
                                style={
                                  typeof Storage !== "undefined" &&
                                  localStorage.getItem("nightMode") === "true"
                                    ? { color: "white" }
                                    : {}
                                }
                              >
                                {user.pendingOwnerChanges.length > 99
                                  ? "99+ transfer requests"
                                  : user.pendingOwnerChanges.length +
                                    (user.pendingOwnerChanges.length === 1
                                      ? " transfer request"
                                      : " transfer requests")}
                              </Typography>
                            </div>
                          </Paper>
                        </Grid>
                      )}
                      <Grid key="create" item>
                        <Paper
                          style={
                            typeof Storage !== "undefined" &&
                            localStorage.getItem("nightMode") === "true"
                              ? {
                                  backgroundColor: "#2f333d",
                                  width: "256px",
                                  height: "192px",
                                  cursor: "pointer",
                                  textAlign: "center",
                                  color: "white",
                                }
                              : {
                                  backgroundColor: "#fff",
                                  width: "256px",
                                  height: "192px",
                                  cursor: "pointer",
                                  textAlign: "center",
                                }
                          }
                          onClick={() => this.setState({ createOpen: true })}
                        >
                          <div
                            style={{
                              paddingTop: "50px",
                              paddingBottom: "50px",
                            }}
                          >
                            <Icon style={{ fontSize: "64px" }}>add</Icon>
                            <br />
                            <Typography
                              variant="h5"
                              style={
                                typeof Storage !== "undefined" &&
                                localStorage.getItem("nightMode") === "true"
                                  ? { color: "white" }
                                  : {}
                              }
                            >
                              New environment
                            </Typography>
                          </div>
                        </Paper>
                      </Grid>
                    </Grid>
                  </div>
                </div>
                <div
                  style={{
                    overflowY: "auto",
                    height: "calc(100vh - 192px)",
                  }}
                >
                  <Typography
                    variant="h4"
                    className="notSelectable defaultCursor"
                    style={
                      nightMode
                        ? {
                            textAlign: "center",
                            marginTop: "8px",
                            marginBottom: "16px",
                            color: "white",
                          }
                        : {
                            textAlign: "center",
                            marginTop: "8px",
                            marginBottom: "16px",
                            color: "black",
                          }
                    }
                  >
                    Shared with you
                  </Typography>
                  <div
                    style={{ height: "calc(100vh - 257px)", overflowY: "auto" }}
                  >
                    <Grid
                      container
                      justify="center"
                      spacing={16}
                      className="notSelectable defaultCursor"
                      style={{
                        width: "calc(100vw - 64px)",
                        marginLeft: "32px",
                        marginRight: "32px",
                      }}
                    >
                      {environmentsList}
                      {user && user.pendingEnvironmentShares[0] && (
                        <Grid key="environmentShares" item>
                          <Paper
                            style={
                              typeof Storage !== "undefined" &&
                              localStorage.getItem("nightMode") === "true"
                                ? {
                                    backgroundColor: "#2f333d",
                                    width: "256px",
                                    height: "192px",
                                    cursor: "pointer",
                                    textAlign: "center",
                                    color: "white",
                                  }
                                : {
                                    backgroundColor: "#fff",
                                    width: "256px",
                                    height: "192px",
                                    cursor: "pointer",
                                    textAlign: "center",
                                  }
                            }
                            onClick={() =>
                              this.setState({ pendingSharesOpen: true })
                            }
                          >
                            <div
                              style={{
                                paddingTop: "50px",
                                paddingBottom: "50px",
                              }}
                            >
                              <Icon
                                style={{
                                  fontSize: "48px",
                                  marginBottom: "8px",
                                  marginTop: "8px",
                                }}
                              >
                                share
                              </Icon>
                              <br />
                              <Typography
                                variant="h5"
                                style={
                                  typeof Storage !== "undefined" &&
                                  localStorage.getItem("nightMode") === "true"
                                    ? { color: "white" }
                                    : {}
                                }
                              >
                                {user.pendingEnvironmentShares.length > 99
                                  ? "99+ pending requests"
                                  : user.pendingEnvironmentShares.length +
                                    (user.pendingEnvironmentShares.length === 1
                                      ? " pending request"
                                      : " pending requests")}
                              </Typography>
                            </div>
                          </Paper>
                        </Grid>
                      )}
                    </Grid>
                  </div>
                </div>
              </SwipeableViews>
            ) : (
              <div
                style={{
                  overflowY: "auto",
                  height: "calc(100vh - 128px)",
                }}
              >
                <Typography
                  variant="h4"
                  className="notSelectable defaultCursor"
                  style={
                    nightMode
                      ? {
                          textAlign: "center",
                          paddingTop: "8px",
                          marginBottom: "16px",
                          color: "white",
                        }
                      : {
                          textAlign: "center",
                          paddingTop: "8px",
                          marginBottom: "16px",
                          color: "black",
                        }
                  }
                >
                  Your environments
                </Typography>
                <div
                  style={{ height: "calc(100vh - 193px)", overflowY: "auto" }}
                >
                  <Grid
                    container
                    justify="center"
                    spacing={16}
                    className="notSelectable defaultCursor"
                    style={{
                      width: "calc(100vw - 64px)",
                      marginLeft: "32px",
                      marginRight: "32px",
                    }}
                  >
                    {yourEnvironmentsList}
                    <Grid key="create" item>
                      <Paper
                        style={
                          typeof Storage !== "undefined" &&
                          localStorage.getItem("nightMode") === "true"
                            ? {
                                backgroundColor: "#2f333d",
                                width: "256px",
                                height: "192px",
                                cursor: "pointer",
                                textAlign: "center",
                                color: "white",
                              }
                            : {
                                backgroundColor: "#fff",
                                width: "256px",
                                height: "192px",
                                cursor: "pointer",
                                textAlign: "center",
                              }
                        }
                        onClick={() => this.setState({ createOpen: true })}
                      >
                        <div
                          style={{ paddingTop: "50px", paddingBottom: "50px" }}
                        >
                          <Icon style={{ fontSize: "64px" }}>add</Icon>
                          <br />
                          <Typography
                            variant="h5"
                            style={
                              typeof Storage !== "undefined" &&
                              localStorage.getItem("nightMode") === "true"
                                ? { color: "white" }
                                : {}
                            }
                          >
                            New environment
                          </Typography>
                        </div>
                      </Paper>
                    </Grid>
                  </Grid>
                </div>
              </div>
            ))}
          {user && (environmentsList[0] || user.pendingEnvironmentShares[0]) && (
            <AppBar
              position="static"
              style={{
                marginBottom: "0px",
                marginTop: "auto",
                height: "64px",
              }}
            >
              <BottomNavigation
                color="primary"
                onChange={this.handleSettingsTabChanged}
                value={this.state.slideIndex}
                showLabels
                style={
                  nightMode
                    ? {
                        height: "64px",
                        backgroundColor: "#2f333d",
                      }
                    : {
                        height: "64px",
                        backgroundColor: "#fff",
                      }
                }
              >
                <BottomNavigationAction
                  icon={<Icon>person</Icon>}
                  label="Your environments"
                  style={
                    nightMode
                      ? this.state.slideIndex === 0
                        ? { color: "#fff" }
                        : { color: "#fff", opacity: 0.5 }
                      : this.state.slideIndex === 0
                      ? { color: "#0083ff" }
                      : { color: "#757575" }
                  }
                />
                <BottomNavigationAction
                  icon={<Icon>group</Icon>}
                  label="Shared with you"
                  style={
                    nightMode
                      ? this.state.slideIndex === 1
                        ? { color: "#fff" }
                        : { color: "#fff", opacity: 0.5 }
                      : this.state.slideIndex === 1
                      ? { color: "#0083ff" }
                      : { color: "#757575" }
                  }
                />
              </BottomNavigation>
            </AppBar>
          )}
        </div>
        <CreateEnvironment
          open={this.state.createOpen}
          close={() => this.setState({ createOpen: false })}
        />
        {user && user.pendingEnvironmentShares && (
          <PendingShares
            open={this.state.pendingSharesOpen}
            close={() => this.setState({ pendingSharesOpen: false })}
            pendingEnvironmentShares={user.pendingEnvironmentShares}
          />
        )}
      </React.Fragment>
    )
  }
}

export default EnvironmentsBodyMobile