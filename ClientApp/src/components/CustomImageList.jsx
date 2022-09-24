import React from 'react';
import {
    GridList,
    GridListTile,
    GridListTileBar,
    IconButton,
    ListSubheader,
} from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectDirectorySelections } from '../reducers/directory.selectors';

function srcset(image, width, height, rows = 1, cols = 1) {
    return {
        src: `${image}?w=${width * cols}&h=${height * rows}&fit=crop&auto=format`,
        srcSet: `${image}?w=${width * cols}&h=${height * rows
            }&fit=crop&auto=format&dpr=2 2x`,
    };
}

const CustomImageList = ({ sections}) => {

    let history = useHistory();
    
    return (
        <GridList cellHeight={200} cols={3}>
            <GridListTile
                key="SubHeader"
                cols={3}
                style={{ height: 50, textAlign: "start" }}                
            >

            </GridListTile>
            {sections.map((data) => (
                <GridListTile key={data.id} cols={3} onClick={() => history.push(`${data.linkUrl}`)}>
                    <img src={data.imageUrl} alt={data.title} />
                    <GridListTileBar
                        title={data.title}
                        style={{ textAlign: "start" }}
                        actionIcon={
                            <IconButton>
                                <InfoIcon style={{ color: "white" }} />
                            </IconButton>
                        }
                    />
                </GridListTile>
            ))}
        </GridList>
    );
}


const mapStateToProps = createStructuredSelector({
    sections: selectDirectorySelections
});


export default connect(mapStateToProps)(CustomImageList);
