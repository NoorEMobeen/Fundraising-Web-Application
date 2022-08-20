import React from 'react';
import './constants/style.css';

const Header = (props) => {
    return (
        <div>
            <h1 className='h1'>{props.header.text}</h1>
        </div>
    )
}

export default Header
