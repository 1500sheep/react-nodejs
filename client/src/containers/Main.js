import React, { Component } from 'react';
import Modal from 'react-modal';
import {_getFetch, _postFetch, getCookie} from "../common/utils";
import './Main.css';
import bitmap2 from './M1files/bitmap@2x.jpg';
import unlikeLogo from './MainFiles/like.svg';
import likeLogo from './MainFiles/like-2.svg';
import commentLogo from './MainFiles/comments.svg';
import tempAvatar from './MainFiles/avatar.jpg';
import tempPost from './MainFiles/loveHan.jpg';
import fillLogo from './MainFiles/fill-2800.svg';
import dotsLogo from './MainFiles/3dots.png';

const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    }
};

class Main extends Component{
    constructor(props) {
        super(props)
        this.state = {
            no_user: '',
            isLoaded : false,
            post_list: [],
            like_post_list:[],
            selectedKey:-1,
            check_cnt:false,
            modalIsOpen: false,
            post_for_comment:{},
            comment:''
        }

        // post list load
        this.load_postlist = this.load_postlist.bind(this);

        // make post list table
        this.renderMainList = this.renderMainList.bind(this);

        // about likes functions
        this.handleLikeSubmit = this.handleLikeSubmit.bind(this);
        this.submitLike = this.submitLike.bind(this);


        // about comment functions
        this.commentOpen = this.commentOpen.bind(this);
        this.handleCommentChange = this.handleCommentChange.bind(this)
        this.handleCommentSubmit = this.handleCommentSubmit.bind(this)
        this.submitComment = this.submitComment.bind(this);
        this.goToComment = this.goToComment.bind(this);

        // about Modal
        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);

    }

    componentDidMount(){
        const no_user = getCookie("no_user");
        this.setState({
            no_user:no_user
        })
        this.load_postlist()
    }
    // main page load data!
    async load_postlist(){
        const url = "http://localhost:7510/db_user/main";
        const res = await _getFetch(url);
        if(res[0]!=null){
            var check_list = []
            for(var i=0;i<res.length;i++){
                const url_cnt = "http://localhost:7510/db_user/main/checklike";
                const Data_cntLike = {
                    cnt_like:{
                        no_pst:res[i].no_pst,
                        no_user:this.state.no_user
                    }
                };
                const res_cnt = await _postFetch(url_cnt,Data_cntLike);
                var cntlist = {
                    no_pst:res[i].no_pst,
                    isLike:res_cnt,
                    cnt_like:res[i].cnt_like
                }
                check_list.push(cntlist)
            }
            this.setState({
                post_list:res,
                isLoaded:true,
                like_post_list:check_list
            });
        } else {
            console.log("no!")
        }
    }

    // post list load(render!)
    renderMainList(){
        if(this.state.post_list === []){
            return null;
        }
        const List = this.state.post_list.map((item,index)=>(
            <div className="Main-header">
                <div className="Main-User">
                    <img src={item.user_uri=='avatar'?tempAvatar:"http://localhost:7402"+item.user_uri} className="Main-Avatar"/>
                    <div>
                        <p className="Main-Nickname">{item.nick_name}</p>
                        <p className="Main-Location"><img src={fillLogo} className="Main-Fill-2800"/> {item.nick_name}</p>
                    </div>
                    <img src={dotsLogo} className="Main-Oval-2-Copy"/>
                </div>
                <img src={"http://localhost:7402"+item.post_uri} className="Main-Post"/>
                <div className="Main-Content">
                    <img src={this.state.like_post_list[index].isLike?likeLogo:unlikeLogo} className="Main-Like2" onClick={()=>this.handleLikeSubmit(index)}/>
                    {this.state.like_post_list[index].cnt_like}
                    <img src={commentLogo} onClick={()=>{this.commentOpen(item)}}/>
                    <div className="Main-sarahannloreth">
                        {item.nick_name}
                    </div>
                    <div className="Main-the-edge-of-New-Zeal">
                        {item.desc}
                    </div>
                    <div className="Main-newzealand-sight-">
                        {item.hash_tag}
                    </div>
                    <div className="Main-View-all-comments">
                        <p onClick={()=>{this.goToComment(item.no_pst)}}>view all comments</p>
                    </div>
                </div>

            </div>
        ));
        return(
            <div>
                {List}
            </div>
        );
    }

    handleLikeSubmit(index){
        this.submitLike(index);
    }

    // submit like!
    async submitLike(index){
        const url_like = "http://localhost:7510/db_user/main/like";
        const Data_like = {
            cnt_like:{
                no_pst:this.state.like_post_list[index].no_pst,
                no_user:this.state.no_user
            },
            check:this.state.like_post_list[index].isLike
        }
        const res_like = await _postFetch(url_like,Data_like);
        let tempList = this.state.like_post_list;
        var count =0;
        if(res_like){
            count = 1;
        }else{
            count = -1;
        }
        tempList[index].isLike = res_like;
        tempList[index].cnt_like += count;
        this.setState({
            like_post_list:tempList
        })
    }

    // function for comment !!
    handleCommentChange(e){
        const target = e.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name] : value
        })
    }

    // make Modal open
    commentOpen(item){
        this.setState({
            post_for_comment:item
        })
        this.openModal();
    }

    // submit comment!
    handleCommentSubmit() {
        this.submitComment();
    }

    // submit comment data to server
    async submitComment(){
        const url_cmt = "http://localhost:7510/db_user/comment/register";
        const Data_cmt = {
            post_cmt:{
                no_pst:this.state.post_for_comment.no_pst,
                no_user:this.state.no_user,
                comment:this.state.comment
            }
        }
        const res_cmt = await _postFetch(url_cmt,Data_cmt);
        if(res_cmt){
            this.setState({
                comment:''
            })
            this.closeModal();
        }else{
            alert('Comment failed');
        }
    }

    // go to comment component
    goToComment(pst){
        this.props.history.push("/comment/"+pst)
    }

    // about modal function
    openModal() {
        this.setState({modalIsOpen: true});
    }

    afterOpenModal() {
        // references are now sync'd and can be accessed.
    }

    closeModal() {
        this.setState({modalIsOpen: false});
    }


    render(){
        return (
            <div>
                <div className="Search-Bar">
                    <img src={bitmap2} className="Main-Bitmap"/>
                </div>
                <div>
                    <Modal
                        isOpen={this.state.modalIsOpen}
                        onAfterOpen={this.afterOpenModal}
                        onRequestClose={this.closeModal}
                        contentLabel="Example Modal"
                        style={customStyles}
                    >
                        <h2>#Comment</h2>
                        <div className="Main-sarahannloreth">{this.state.post_for_comment.nick_name}</div>
                        <div className="Main-the-edge-of-New-Zeal">{this.state.post_for_comment.desc}</div>
                        <input type="textarea" className="Upload-Rectangle-Input" placeholder="comment" name="comment" value={this.state.comment} onChange={this.handleCommentChange}/>
                        <button onClick={this.closeModal}>cancel</button>
                        <button onClick={this.handleCommentSubmit}>send</button>
                    </Modal>
                    {this.state.isLoaded? this.renderMainList() : null}
                </div>
            </div>
        );
    }
}

export default Main;