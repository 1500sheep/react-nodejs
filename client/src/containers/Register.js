import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import bitmap1 from './M1files/bitmap.jpg';
import "./Register.css"
import {_postFetch} from "../common/utils";

class Register extends Component{
    constructor(props){
        super(props)
        this.state = {
            nick_name:"",
            email:"",
            password:""
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.submit = this.submit.bind(this);
    }

    /*
    *   input tag 의 name 과 value 들이 다 똑같게 되면 여러개의 태그가 있어도 알아서 매칭되서 들어간다!! 이거 엄청난 Tip!!
    * */
    handleChange(e){
        const target = e.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name] : value
        })
    }


    handleSubmit() {
        this.submit();
    }

    componentDidMount(){
        console.log(this.props)
    }

    async submit (){
        const url_check = "http://localhost:7510/db_user/user/check/";
        const Data_check = {
                email:this.state.email
        }
        const res_check = await _postFetch(url_check,Data_check);
        console.log(res_check);
        if(res_check=="nothing") {
            const url_register = "http://localhost:7510/db_user/user/register/";
            const Data_register = {
                user:{
                    nick_name:this.state.nick_name
                },
                user_dt:{
                },
                user_auth:{
                    email:this.state.email,
                    password:this.state.password
                }
            }
            const res_register = await _postFetch(url_register,Data_register);
            if(res_register=="success") {
                alert("signed up!")
                this.props.history.push('/');
            }else{
                alert("nick already exists");
            }

        }else if(res_check=="existing"){
            alert("email already exists");
        }else{
            alert("email empty");
        }



    }

    render(){
        return (
            <div>
                <div>
                    <img src={bitmap1} className="M1-Bitmap"/>
                </div>
                    <div className="Register-Rectangle-3">
                        <input type="text" name="nick_name" value={this.state.nick_name}  placeholder="nickname" onChange={this.handleChange}/>
                    </div>
                    <div className="Register-Rectangle-3 email">
                        <input type="email" name="email" value={this.state.email} placeholder="email" onChange={this.handleChange}/>
                    </div>
                    <div className="Register-Rectangle-3 password">
                        <input type="password" name="password" value={this.state.password} placeholder="password" onChange={this.handleChange}/>
                    </div>
                    <div className="Register-Rectangle-3 register" onClick={this.handleSubmit}>
                        <p className="Register-Register">Register</p>
                    </div>

            </div>
        );
    }
}

export default withRouter(Register);