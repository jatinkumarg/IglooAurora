import React, {Component} from "react"
import Paper from "material-ui/Paper"
import {
    Toolbar,
    ToolbarGroup,
    ToolbarSeparator,
    ToolbarTitle,
} from "material-ui/Toolbar"
import IconButton from "material-ui/IconButton"
import ReadOnlyBooleanTile from "./ReadOnlyBooleanTile"
import ReadWriteBoundedFloatTile from "./ReadWriteBoundedFloatTile"

class Tile extends Component {
    render() {
        const {value} = this.props
        const valueTitle = value.customName
        const valueHidden = value.relevance === "HIDDEN"
        let specificTile
        if (
            value.__typename === "BooleanValue" &&
            value.permission === "READ_ONLY"
        ) {
            specificTile = <ReadOnlyBooleanTile value={value.boolValue} />
        } else if (
            value.__typename === "FloatValue" &&
            value.boundaries &&
            value.permission === "READ_WRITE"
        ) {
            specificTile = (
                <ReadWriteBoundedFloatTile
                    min={value.boundaries[0]}
                    max={value.boundaries[1]}
                    defaultValue={value.floatValue}
                    step={value.precision || undefined} // avoid passing null, pass undefined instead
                />
            )
        } else {
            specificTile = ""
        }

        return (
            <Paper className={this.props.className || ""} zDepth={2}>
                <Toolbar>
                    <ToolbarGroup>
                        <ToolbarTitle text={valueTitle} />
                    </ToolbarGroup>
                    <ToolbarGroup lastChild={true}>
                        {valueHidden ? (
                            <IconButton
                                iconClassName="fas fa-eye"
                                tooltip="Hide"
                            />
                        ) : (
                            <IconButton
                                iconClassName="fas fa-eye-slash"
                                tooltip="Show"
                            />
                        )}

                        <IconButton
                            iconClassName="fas fa-expand-arrows-alt"
                            tooltip="Expand"
                        />
                    </ToolbarGroup>
                </Toolbar>
                {specificTile}
            </Paper>
        )
    }
}

export default Tile
