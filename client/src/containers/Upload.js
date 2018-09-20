import React, { Component } from 'react';
import "./Upload.css"
import backLogo from './MainFiles/back.svg';
import {_postFetch, _postImgFetch, _putFetch, getCookie} from "../common/utils";

class Upload extends Component {
    constructor(props) {
        super(props)
        this.state = {
            no_user:'',
            description:'',
            tag:'',
            file:''
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.submit = this.submit.bind(this)

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


    handleSubmit(event) {
        event.preventDefault();
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
        const url = "http://localhost:7510/db_user/post/register";
        const Data = {
            post:{
                no_user:this.state.no_user,
                desc:this.state.description,
                hash_tag:this.state.tag,
                post_uri:result_img.uri,
                no_post_uri:result_img.no_photo
            },
            tag:{},
            tag_item:{}
        }

        const res = await _postFetch(url,Data);
        if(res=="success") {
            this.props.history.push('/');
        }else{
            alert("ohno ya!");
        }


    }


    render(){
        return(
            <div>
                <div className="Upload-Bar">
                    <span className="Upload-Profile">Upload</span>
                    <input type="button" value="upload" className="Upload-Done" onClick={this.handleSubmit}/>
                </div>
                <div className="Upload-Bg">
                    <div>
                        <input type="file" name="file" defaultValue="fileName"/>
                    </div>
                    <input type="textarea" className="Upload-Rectangle-Input" placeholder="description" name="description" value={this.state.description} onChange={this.handleChange}/>
                    <input type="textarea" className="Upload-Rectangle-Input" placeholder="tag" name="tag" value={this.state.tag} onChange={this.handleChange}/>
                </div>
            </div>
        );
    }

}

export default Upload;