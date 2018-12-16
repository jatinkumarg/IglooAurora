import React, { Component } from "react"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogActions from "@material-ui/core/DialogActions"
import Button from "@material-ui/core/Button"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import RadioGroup from "@material-ui/core/RadioGroup"
import Radio from "@material-ui/core/Radio"
import FormControlLabel from "@material-ui/core/FormControlLabel"

const MOBILE_WIDTH = 600

function Transition(props) {
  return window.innerWidth > MOBILE_WIDTH ? (
    <Grow {...props} />
  ) : (
    <Slide direction="up" {...props} />
  )
}

export default class ChangeRole extends Component {
  constructor(props) {
    super(props)

    this.state = { email: "", value: null }
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.close}
        className="notSelectable defaultCursor"
        TransitionComponent={Transition}
        fullScreen={window.innerWidth < MOBILE_WIDTH}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle disableTypography>Change role</DialogTitle>
        <RadioGroup
          onChange={event => {
            this.setState({ value: event.target.value })
            this.props.changeRole(event.target.value)
          }}
          value={this.state.value || this.props.selectedUserType}
          style={{ paddingLeft: "24px", paddingRight: "24px" }}
        >
          <FormControlLabel
            value="admin"
            control={<Radio color="primary" />}
            label="Admin"
          />
          <FormControlLabel
            value="editor"
            control={<Radio color="primary" />}
            label="Editor"
          />
          <FormControlLabel
            value="spectator"
            control={<Radio color="primary" />}
            label="Spectator"
          />
        </RadioGroup>
        <DialogActions>
          <Button onClick={this.props.close}>Close</Button>
        </DialogActions>
      </Dialog>
    )
  }
}