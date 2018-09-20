var express = require('express');
var router = express.Router();

import views from './views.js';
import multipart from '../common/multipart'

// fs.unlinkSync(file.path) 로 완료 후 파일을 삭제하기 때문에 directory 구분할 필요가 없다
var multipartMiddleware = multipart({uploadDir:"files/"});

router.post('/sound/upload', multipartMiddleware, views.createSound);

router.post('/img/upload', multipartMiddleware, views.createImage);

router.delete('/:id', views.delete);

// 여기서부터 fileserver system입니다.
var co = require('co');
var fs = require('co-fs');
var path = require('path');
var origFs = require('fs');

var Tools = require('../fileSystem/tools');
var FilePath = require('../fileSystem/fileMap').filePath;
var FileManager = require('../fileSystem/fileManager');

var data = [];

router.get('/files', co.wrap(function* (req, res) {
    var {directory} = req.query;

    console.log("check directory : ",directory);

    if(!directory) {
        directory = '';
    }
    var p = '.'+directory;

    var stats = yield fs.stat(p);
    if(stats.isDirectory()){
        data = yield * FileManager.list(p);
        console.log("check Filemanager : ",data);
    }

    console.log("data : ",data);
    var results = JSON.stringify({
        status: 200,
        results: data
    });
    res.json(results);
}));



module.exports = router;
