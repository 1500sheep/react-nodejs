import React, { Component } from 'react';
import './M1.css';
import bitmap1 from './M1files/bitmap.jpg';
import bitmap2 from './M1files/bitmap@2x.jpg';
import bitmap3 from './M1files/bitmap@3x.jpg';


/*
 못한 부분은 srcset은 뭐여 왜 안먹혀
 */
class M1 extends Component{
    constructor(props){
        super(props)
        this.handleChange = this.handleChange.bind(this)
    }
    handleChange(href){
        this.props.history.push(href);
    }
    render(){
        return (
            <div>
                <div>
                    <img src={bitmap1} className="M1-Bitmap"/>
                </div>
                <div className="btn" onClick={()=> this.handleChange('/login')}>
                            <p className="M1-Word">Login</p>
                </div>
                <div className="btn blue" onClick={()=> this.handleChange('/register')}>
                    <p className="M1-Word Word2">Register</p>
                </div>
            </div>
        );
    }
}

export default M1;