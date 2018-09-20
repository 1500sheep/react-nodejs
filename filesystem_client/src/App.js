import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {_getFetch} from "./common/utils";
import fileIcon from './images/file-icon.png';
import folderIcon from './images/folder-icob.png';

class App extends Component {
  constructor(props){
      super(props)
      this.state={
          isLoaded:false,
          list:[],
          directory:''
      }

      this.load_fileList = this.load_fileList.bind(this);

      this.renderHomeList = this.renderHomeList.bind(this);
      this.renderFileList = this.renderFileList.bind(this);

      this.file_downLoad = this.file_downLoad.bind(this);

      this.changeDir = this.changeDir.bind(this);

  }

  componentDidMount(){
      this.load_fileList("");
  }

  async load_fileList(directory){
      var url = "http://localhost:7402/media/files?directory=";
      var temp_dir = directory;
      url+=temp_dir;

      this.setState({
        directory:temp_dir
      });

      const res = await _getFetch(url);

      if(res[0]!=null){
          this.setState({
              list:res,
              isLoaded:true
          })
      }
  }



  async file_downLoad(file){
    alert("파일 이름 "+file)
  }

  changeDir(item){
      var temp_dir = this.state.directory;
      var sep_dir = temp_dir.substring(0,temp_dir.indexOf(item)+item.length);
      this.load_fileList(sep_dir);
  }

  renderHomeList(){
    const List = this.state.directory.split("/").map((item,index)=>(
        <div>
            <a onClick={()=>{this.changeDir(item)}}>{item?item:"Home"}</a>
            <span> / </span>
        </div>
    ));
    return(
        <div>
            {List}
        </div>
    )
  }

  renderFileList(){
      if(this.state.list === []){
          return null;
      }
      const List = this.state.list.map((item,index)=>(
          <div onClick={item.folder?()=>{this.load_fileList(this.state.directory+"/"+item.name)}:()=>{this.file_downLoad(item.name)}}>
              <img src={item.folder?folderIcon:fileIcon} className="App-Icon" />
              <a>size {item.size}</a>
              <a>mtime {item.mtime}</a>
              <a>name {item.name}</a>
          </div>
      ));
      return(
          <div>
              {List}
          </div>
      );
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
          <div>
              {this.state.isLoaded? this.renderHomeList() : null}
          </div>
          <div>
              {this.state.isLoaded? this.renderFileList() : null}
          </div>
      </div>
    );
  }
}

export default App;
