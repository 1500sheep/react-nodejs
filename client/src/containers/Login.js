import React, { Component } from 'react';
import bitmap1 from './M1files/bitmap.jpg';
import "./Login.css"
import {_postFetch, _putFetch, setCookie , getCookie} from "../common/utils";

class Login extends Component{
    constructor(props){
        super(props)
        this.state = {
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


    }

    async submit (){
        const url_check = "http://localhost:7510/db_user/user/check/";
        const Data_check = {
            email:this.state.email
        }
        const res_check = await _postFetch(url_check,Data_check);
        console.log(res_check);
        if(res_check=="existing") {
            const url_login = "http://localhost:7510/db_user/user/auth/login/";
            const Data_login = {
                user:{
                },
                user_auth:{
                    email:this.state.email,
                    password:this.state.password
                }
            }
            const res_login = await _putFetch(url_login,Data_login);
            if(res_login.status=="success") {
                setCookie("no_user",res_login.user.no_user,1);

                // component를 나누기 위해서 새로 렌더링을 할 것이다~!
                window.location.assign('/');
            }else{
                alert(res_login);
            }

        }else if(res_check=="nothing"){
            alert("email does not exist");
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
                <div className="Login-Rectangle-3">
                    <input type="email" name="email" value={this.state.email} placeholder="email" onChange={this.handleChange}/>
                </div>
                <div className="Login-Rectangle-3 password">
                    <input type="password" name="password" value={this.state.password} placeholder="password" onChange={this.handleChange}/>
                </div>
                <div className="Login-Rectangle-3 Login" onClick={this.handleSubmit}>
                    <p className="Login-Login">Login</p>
                </div>
            </div>
        );
    }
}

export default Login;