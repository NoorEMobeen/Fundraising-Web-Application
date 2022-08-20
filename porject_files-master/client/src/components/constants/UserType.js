import React from 'react'

class UserType{
    constructor(props){
        this.state={value:''};
        this.setValue=this.setValue.bind(this);
    }
    setValue(title){
        this.state=title;
    }
}

export default UserType;