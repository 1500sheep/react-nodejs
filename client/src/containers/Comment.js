import React, { Component } from 'react';
import Modal from 'react-modal';
import {_getFetch, _postFetch, _putFetch, getCookie} from "../common/utils";
import './Main.css';
import './Comment.css'
import bitmap2 from './M1files/bitmap@2x.jpg';
import likeLogo from './MainFiles/like.svg';
import commentLogo from './MainFiles/comments.svg';
import backLogo from './MainFiles/back.svg';
import tempAvatar from './MainFiles/sheep_profile.png';

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


class Comment extends Component{
    constructor(props) {
        super(props)
        var no_pst = this.props.location.pathname.split('/').pop();
        this.state = {
            no_user: "",
            is_Loaded:false,
            no_pst : no_pst,
            comment_list: [],
            reply_list_comment:[],
            comment_for_reply:{},
            reply:'',
            modalIsOpen: false,
            index_list:-1
        }
        // comment list load
        this.load_commentlist = this.load_commentlist.bind(this);

        // comment list render!
        this.renderCommentList = this.renderCommentList.bind(this);

        // open reply Modal
        this.replyComment = this.replyComment.bind(this);
        this.handleReplyChange = this.handleReplyChange.bind(this)
        this.handleReplySubmit = this.handleReplySubmit.bind(this)
        this.replySubmit  = this.replySubmit.bind(this)

        // about Modal
        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);

        this.goToMain = this.goToMain.bind(this);

    }

    componentDidMount(){
        const no_user = getCookie("no_user");
        this.setState({
            no_user:no_user
        })
        this.load_commentlist();
    }
    // comment page load data
    async load_commentlist(){
        const url = "http://localhost:7510/db_user/comment/list";
        const Data= {
            no_pst:this.state.no_pst
        }
        const res = await _postFetch(url,Data);
        if(res[0]!=null){
            var reply_list =new Array();
            for(var i=0;i<res.length;i++){
                const url_reply = "http://localhost:7510/db_user/reply/list";
                const Data_reply = {
                    no_pst_cmt: res[i].no_post_cmt
                }
                const res_reply = await _postFetch(url_reply,Data_reply);
                var temp_list = res_reply;
                reply_list.push(temp_list);
            }

            this.setState({
                comment_list:res,
                reply_list_comment:reply_list,
                is_Loaded:true
            });
        }else{
            alert('Comment does not exist');
            this.goToMain();
        }
    }

    // render page
    renderCommentList(){
        if(this.state.comment_list === []){
            return null;
        }
        const List = this.state.comment_list.map((item,index)=>(
            <div>
                <div className="Comment-Item">
                    <img src={item.user_uri=='avatar'?tempAvatar:"http://localhost:7402"+item.user_uri} className="Comment-Avatar"/>
                    <div className="Comment-Box">
                        <p className="Comment-Nickname">{item.nick_name}  <img src={commentLogo} onClick={()=>{this.replyComment(index)}}/></p>
                        <p className="Comment-Location">{item.comment}</p>
                    </div>
                </div>
                <div>
                    {this.renderReplyList(index)}
                </div>
            </div>
        ));
        return (
            <div>
                {List}
            </div>
        )
    }

    replyComment(index){
        this.setState({
            comment_for_reply:this.state.comment_list[index],
            index_list:index
        })
        this.openModal();
    }

    handleReplyChange(e){
        const target = e.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name] : value
        })
    }


    handleReplySubmit() {
        this.replySubmit();
    }

    async replySubmit(){
        const url = "http://localhost:7510/db_user/reply/register";
        const Data= {
            post_rep:{
                no_pst:this.state.no_pst,
                no_pst_cmt:this.state.comment_for_reply.no_post_cmt,
                no_user:this.state.no_user,
                comment:this.state.reply
            }
        }
        const res = await _postFetch(url,Data);
        if(res){
            var temp_list = this.state.reply_list_comment;

            if(temp_list[this.state.index_list]){
                temp_list[this.state.index_list].push(res[0]);
            }else{
                temp_list[this.state.index_list] = new Array;
                temp_list[this.state.index_list].push(res[0]);
            }
            this.setState({
                reply:'',
                comment_for_reply:'',
                reply_list_comment:temp_list,
                index_list:-1
            })
            this.closeModal();
        }else{
            alert('Comment does not exist');
            this.goToMain();
        }
    }


    renderReplyList(index){
        if(this.state.reply_list_comment[index] === []){
            return null;
        }
        if(!this.state.reply_list_comment[index]){
            return null;
        }
        const List = this.state.reply_list_comment[index].map((item,index)=>(
            <div className="Comment-Item Reply">
                <img src={item.user_uri=='avatar'?tempAvatar:"http://localhost:7402"+item.user_uri} className="Comment-Avatar"/>
                <div className="Comment-Box">
                    <p className="Comment-Nickname">{item.nick_name}</p>
                    <p className="Comment-Location">{item.comment}</p>
                </div>
            </div>
        ));
        return (
            <div>
                {List}
            </div>
        )
    }

    // main page back
    goToMain(){
        this.props.history.push('/');
    }

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
                <div className="Profile-Bar">
                    <img src={backLogo} className="Profile-Back" onClick={this.goToMain}/>
                    <span className="Profile-Profile">Reply</span>
                </div>
                <div className="Profile-Bg">
                    {this.renderCommentList()}
                </div>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    contentLabel="Example Modal"
                    style={customStyles}
                >
                    <h2>#Reply</h2>
                    <div className="Main-sarahannloreth">{this.state.comment_for_reply.nick_name}</div>
                    <div className="Main-the-edge-of-New-Zeal">{this.state.comment_for_reply.comment}</div>
                    <input type="textarea" className="Upload-Rectangle-Input" placeholder="reply" name="reply" value={this.state.reply} onChange={this.handleReplyChange}/>
                    <button onClick={this.closeModal}>cancel</button>
                    <button onClick={this.handleReplySubmit}>send</button>
                </Modal>
            </div>
        );
    }
}

export default Comment;