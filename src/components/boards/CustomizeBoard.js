import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Button from "@material-ui/core/Button"
import FormControl from "@material-ui/core/FormControl"
import Input from "@material-ui/core/Input"
import InputAdornment from "@material-ui/core/InputAdornment"
import IconButton from "@material-ui/core/IconButton"
import Icon from "@material-ui/core/Icon"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogTitle from "@material-ui/core/DialogTitle"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import SwipeableViews from "react-swipeable-views"
import fox from "../../styles/assets/fox.jpg"
import northernLights from "../../styles/assets/northernLights.jpg"
import denali from "../../styles/assets/denali.jpg"
import puffin from "../../styles/assets/puffin.jpg"
import treetops from "../../styles/assets/treetops.jpg"

const MOBILE_WIDTH = 600

function Transition(props) {
  return window.innerWidth > MOBILE_WIDTH ? (
    <Grow {...props} />
  ) : (
    <Slide direction="up" {...props} />
  )
}

class CustomizeBoard extends React.Component {
  state = {
    name: this.props.board.name,
    slideIndex: 0,
    initialSlideIndex: 0,
  }

  selectImage = index => {
    switch (index) {
      case 0:
        return "DENALI"
      case 1:
        return "FOX"

      case 2:
        return "TREETOPS"

      case 3:
        return "PUFFIN"

      case 4:
        return "NORTHERN_LIGHTS"

      default:
        return "NORTHERN_LIGHTS"
    }
  }

  rename = () => {
    this.props["Rename"]({
      variables: {
        id: this.props.board.id,
        name: this.state.name,
        avatar: this.selectImage(this.state.slideIndex),
      },
      optimisticResponse: {
        __typename: "Mutation",
        board: {
          __typename: this.props.board.__typename,
          id: this.props.board.id,
          name: this.state.name,
          avatar: this.selectImage(this.state.slideIndex),
        },
      },
    })
    this.props.close()
  }

  componentDidMount() {
    switch (this.props.board.avatar) {
      case "DENALI":
        this.setState({ slideIndex: 0, initialSlideIndex: 0 })
        break
      case "FOX":
        this.setState({ slideIndex: 1, initialSlideIndex: 1 })
        break
      case "TREETOPS":
        this.setState({ slideIndex: 2, initialSlideIndex: 2 })
        break
      case "PUFFIN":
        this.setState({ slideIndex: 3, initialSlideIndex: 3 })
        break
      case "NORTHERN_LIGHTS":
        this.setState({ slideIndex: 4, initialSlideIndex: 4 })
        break
      default:
        this.setState({ slideIndex: 0, initialSlideIndex: 0 })
        break
    }
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
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle disableTypography>Customize board</DialogTitle>
        <div style={{ height: "100%" }}>
          <FormControl
            style={{
              width: "calc(100% - 48px)",
              paddingLeft: "24px",
              paddingRight: "24px",
            }}
          >
            <Input
              id="adornment-name-login"
              placeholder="Board Name"
              value={this.state.name}
              onChange={event =>
                this.setState({
                  name: event.target.value,
                })
              }
              onKeyPress={event => {
                if (event.key === "Enter") this.rename()
              }}
              endAdornment={
                this.state.name ? (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => this.setState({ name: "" })}
                      onMouseDown={this.handleMouseDownPassword}
                      tabIndex="-1"
                      style={
                        typeof Storage !== "undefined" &&
                        localStorage.getItem("nightMode") === "true"
                          ? { color: "white" }
                          : { color: "black" }
                      }
                    >
                      <Icon>clear</Icon>
                    </IconButton>
                  </InputAdornment>
                ) : null
              }
            />
          </FormControl>

          <br />
          <br />
          <SwipeableViews
            index={this.state.slideIndex}
            onChangeIndex={value => {
              this.setState({
                slideIndex: value,
              })
            }}
            style={
              window.innerWidth < MOBILE_WIDTH
                ? {
                    width: "calc(100vw - 48px)",
                    marginLeft: "24px",
                    marginRight: "24px",
                  }
                : { width: "350px", marginLeft: "24px", marginRight: "24px" }
            }
          >
            <img
              src={denali}
              alt="Mt. Denali"
              className="notSelectable"
              style={{
                width: "100%",
              }}
            />
            <img
              src={fox}
              alt="Fox"
              className="notSelectable"
              style={{
                width: "100%",
              }}
            />
            <img
              src={treetops}
              alt="treetops"
              className="notSelectable"
              style={{
                width: "100%",
              }}
            />
            <img
              src={puffin}
              alt="Puffin"
              className="notSelectable"
              style={{
                width: "100%",
              }}
            />
            <img
              src={northernLights}
              alt="Northern lights"
              className="notSelectable"
              style={{
                width: "100%",
              }}
            />
          </SwipeableViews>
          <div>
            <Button
              size="small"
              onClick={() =>
                this.setState(oldState => ({
                  slideIndex: oldState.slideIndex - 1,
                }))
              }
              disabled={this.state.slideIndex === 0}
              style={{ width: "73px", marginLeft: "24px" }}
            >
              <Icon>keyboard_arrow_left</Icon>
              Back
            </Button>
            <Button
              size="small"
              onClick={() =>
                this.setState(oldState => ({
                  slideIndex: oldState.slideIndex + 1,
                }))
              }
              disabled={this.state.slideIndex === 4}
              style={{
                width: "73px",
                float: "right",
                marginRight: "24px",
                marginLeft: "auto",
              }}
            >
              Next
              <Icon>keyboard_arrow_right</Icon>
            </Button>
          </div>
        </div>
        <DialogActions>
          <Button onClick={this.props.close}>Never mind</Button>
          <Button
            variant="contained"
            color="primary"
            primary={true}
            buttonStyle={{ backgroundColor: "#0083ff" }}
            onClick={this.rename}
            disabled={
              !this.state.name ||
              (this.state.initialSlideIndex === this.state.slideIndex &&
                this.props.board.name === this.state.name)
            }
          >
            Customize
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default graphql(
  gql`
    mutation Rename($id: ID!, $name: String, $avatar: BoardPicture) {
      board(id: $id, name: $name, avatar: $avatar) {
        id
        name
        avatar
      }
    }
  `,
  {
    name: "Rename",
  }
)(CustomizeBoard)
