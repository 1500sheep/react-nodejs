import React, { Component } from 'react';
import "./Profile.css"
import backLogo from './MainFiles/back.svg';
import {_postFetch, _postImgFetch, _putFetch, getCookie} from "../common/utils";

class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            no_user: "",
            file:''
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.submit = this.submit.bind(this);
        this.goToMain = this.goToMain.bind(this);
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


    handleSubmit(e) {
        e.preventDefault();
        this.submit();
    }

    componentDidMount(){
        const no_user = getCookie("no_user");
        this.setState({
            no_user:no_user
        })

    }
    async submit (){
        const url_img = 'http://localhost:7401/media/img/upload';
        let dataForm = new FormData();
        var imageData = document.querySelector('input[type="file"]').files[0];

        dataForm.append('type', 'image');
        dataForm.append('kind', 'product');
        dataForm.append('data',imageData);

        const result = await _postImgFetch(url_img,dataForm);
        const result_img = result[0];
        const url = "http://localhost:7510/db_user/profile/upload";
        const Data = {
            user:{
                no_user:this.state.no_user,
                user_uri:result_img.uri
            }
        }

        const res = await _postFetch(url,Data);
        if(res=="success") {
            this.props.history.push('/');
        }else{
            alert("fuck ya!");
        }


    }

    // main page back
    goToMain(){
        this.props.history.push('/');
    }

    render(){
        return(
            <div>
                <div className="Profile-Bar">
                    <img src={backLogo} className="Profile-Back" onClick={this.goToMain}/>
                    <span href="#" className="Profile-Profile">Profile</span>
                    <span href="#" className="Profile-Done">Done</span>
                </div>
                <div className="Profile-Bg">
                    <div>
                        <input type="file" name="file" defaultValue="fileName"/>
                    </div>
                    <div className="Profile-Rectangle">
                        <input type="button" value="+Upload Profile" className="Profile-Upload-Profile" onClick={this.handleSubmit}/>
                    </div>
                </div>
            </div>
        );
    }

}

export default Profile;