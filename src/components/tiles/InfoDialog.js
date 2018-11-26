import React from "react"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogTitle from "@material-ui/core/DialogTitle"
import Button from "@material-ui/core/Button"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import moment from "moment"
import Moment from "react-moment"

const MOBILE_WIDTH = 600

function Transition(props) {
  return window.innerWidth > MOBILE_WIDTH ? (
    <Grow {...props} />
  ) : (
    <Slide direction="up" {...props} />
  )
}

class InfoDialog extends React.Component {
  state = { showHidden: false }

  render() {
    return (
      <Dialog
        open={this.props.infoOpen}
        onClose={this.props.handleInfoClose}
        TransitionComponent={Transition}
        fullScreen={window.innerWidth < MOBILE_WIDTH}
      >
        <DialogTitle
          style={{ width: "350px" }}
          className="notSelectable defaultCursor"
        >
          Device information
        </DialogTitle>
        <div
          style={{ paddingRight: "24px", marginLeft: "24px", height: "100%" }}
        >
          <b>Created: </b>
          <Moment fromNow>
            {moment.utc(
              this.props.createdAt.split(".")[0],
              "YYYY-MM-DDTh:mm:ss"
            )}
          </Moment>
          <br />
          <br />
          <b>Last updated: </b>
          <Moment fromNow>
            {moment.utc(
              this.props.updatedAt.split(".")[0],
              "YYYY-MM-DDTh:mm:ss"
            )}
          </Moment>
          {this.props.devMode ? (
            <React.Fragment>
              <br />
              <br />
              <b>ID: </b> {this.props.id}
            </React.Fragment>
          ) : (
            ""
          )}
        </div>
        <DialogActions style={{ marginLeft: "8px", marginRight: "8px" }}>
          <Button onClick={this.props.handleInfoClose}>Close</Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default InfoDialog
