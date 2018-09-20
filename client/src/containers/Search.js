import React, { Component } from 'react';
import "./Search.css"
import backLogo from './MainFiles/back.svg';
import shopLogo from './MainFiles/invalid-name.svg';
import {_getFetch, _postFetch, _putFetch, getCookie} from "../common/utils";

class Search extends Component {
    constructor(props) {
        super(props)
        this.state = {
            no_user: "",
            tag: '',
            list: [],
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.submit = this.submit.bind(this);
        this.renderTableList = this.renderTableList.bind(this);
        this.goToMain = this.goToMain.bind(this);

        this.sendTagpost = this.sendTagpost.bind(this);
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
        },()=>{
            var str = this.state.tag.toString();
            if(str.length >= 3){
                this.submit();
            }
        })
    }


    handleSubmit() {

    }

    componentDidMount(){
        const no_user = getCookie("no_user");
        this.setState({
            no_user:no_user
        })

    }

    async submit(){
        const url = "http://localhost:7510/db_user/tag/search?tag="+this.state.tag;
        const res = await _getFetch(url);
        if(res[0]!=null){
            var tab = document.getElementById("table-tag")
            this.setState({
                list:res
            });
        }

    }

    renderTableList(){
        if(this.state.list === []){
            return null;
        }
        const List = this.state.list.map((item,index)=>(
            <div className="Search-tags">
                <img src={shopLogo} className="Search-layer"/>
                <div className="Search-tagBox" onClick={()=>{this.sendTagpost(item.tag)}}>
                    <p className="Search-tagitem">#{item.tag}</p>
                    <p className="Search-posts">{item.cnt} posts</p>
                </div>
            </div>
        ));
        return (
            <div>
                {List}
            </div>
        )
    }

    sendTagpost(tag){
        this.props.history.push("/hashtag/"+tag)
    }
    // main page back
    goToMain(){
        this.props.history.push('/');
    }

    render(){
        return(
            <div>
                <div className="Search-Bar">
                    <div className="Search-Rectangle-121">
                        <input type="text" name="tag" value={this.state.tag} placeholder="search new tag" onChange={this.handleChange}/>
                    </div>
                    <p className="Search-Cancel" onClick={this.goToMain}>Cancel</p>
                </div>
                <div className="Profile-Bg">
                    {this.renderTableList()}
                </div>
            </div>
        );
    }

}

export default Search;