import React from 'react';
import MenuItem from "./MenuItem";
import '../styles/directory.styles.scss';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectDirectorySelections } from '../reducers/directory.selectors';

const Directory = ({ sections }) => (
    <div className='directory-menu'>
        {
            sections.map(({ id, ...otherSectionProps }) => (
                <MenuItem key={id} {...otherSectionProps} />
            ))
        }
    </div>
);


const mapStateToProps = createStructuredSelector({
    sections: selectDirectorySelections
});


export default connect(mapStateToProps)(Directory);