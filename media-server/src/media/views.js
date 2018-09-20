import co from 'co';
import os from 'os';
import fs from 'fs';
import path from 'path';
import uuidv4 from 'uuid/v4';
import {MEDIA_DIRECTORY,ORIGINAL_DIRECTORY} from '../common/settings';
import response from '../common/response';
import sequelize from '../common/database';

// audio duration 갖고 오는 npm
const getDuration = require('get-audio-duration');
const {Image,Sound} = sequelize.import('./models');
const {stream_to_file,watermarking,changeFilename} = require('../common/utils');

async function createMediaSound(body, file, duration){
    // 기존 파일을 watermark 할 때의 file name
    const uuid = uuidv4();

    const temp = file.fieldName.split('/')
    const originalFilename = file.originalFilename;
    const name = temp.pop();
    const fileExtension = file.name.split('.').pop();

    const fileType = file.type.split('/').reverse().pop();

    const kind = file.name.split('.').pop();

    const inputFile = file.path;

    if(fileType=="audio") {
        // type - img / sound
        // kind - extension (mp3,wav)

        const _path_original = '/original_sound/'+kind;
        const _path_encrypted = '/sound/encrypted/' + kind;
        const _path_watermark = '/watermarked/' + kind;

        // original file directory
        const dir_original = path.join(ORIGINAL_DIRECTORY,_path_original || '');
        if(!fs.existsSync(dir_original)){
            fs.mkdirSync(dir_original);
        }

        // uuid(encrypted) file directory
        const dir_encrypted = path.join(MEDIA_DIRECTORY, _path_encrypted || '');
        if (!fs.existsSync(dir_encrypted)) {
            fs.mkdirSync(dir_encrypted);
        }

        // watermark directory
        const dir_watermark = path.join(ORIGINAL_DIRECTORY, _path_watermark || '');
        if (!fs.existsSync(dir_watermark)) {
            fs.mkdirSync(dir_watermark);
        }

        const fileName = `${kind}_${uuid}.${fileExtension}`;

        let filePath_original = path.join(dir_original, originalFilename);
        if(fs.existsSync(filePath_original)){
            // async await
            filePath_original = await changeFilename(filePath_original);
        }
        let filePath_encrypted = path.join(dir_encrypted, fileName)+'.enc';

        if(fs.existsSync(filePath_encrypted)){
            // async await
            filePath_encrypted = await changeFilename(filePath_encrypted);
        }
        let filePath_watermark = path.join(dir_watermark, originalFilename);
        if(fs.existsSync(filePath_watermark)){
            // async await
            filePath_watermark = await changeFilename(filePath_watermark);
        }

        // file read, write
        stream_to_file(inputFile,[filePath_original,filePath_encrypted]);

        // watermark sound
        watermarking(inputFile, filePath_watermark, fileExtension, duration);

        const sound = {
            origin_name: file.name,
            file_name: fileName,
            origin_file_path: filePath_original,
            watermark_file_path: filePath_watermark,
            encrypt_file_path: filePath_encrypted,
            file_type: fileType,
            file_size: file.size,
            extension: fileExtension,
            duration : duration
        };

        return Sound.create(sound).then(sound => {
            const result = {
                // ...media.dataValues,
                // uri: `${_path}/${filePath}`,
                no_audio: sound.dataValues.no_audio,
                uri: `/${filePath_encrypted}`,
            }
            return result;
        }).catch(err => {
            console.log(err);
            // createMedia(body, file);
        });
    }
};

const createMediaImage = (body, file) => {
    const uuid = uuidv4();

    const temp = file.fieldName.split('/')
    const originalFilename = file.originalFilename;
    const fileExtension = file.name.split('.').pop();

    const fileType = file.type.split('/').reverse().pop();

    const kind = file.name.split('.').pop();
    const inputFile = file.path;

    if(fileType=="image"){

        const _path = '/image/' + kind;

        const fileName = `${kind}_${uuid}.${fileExtension}`;
        const dir = path.join(MEDIA_DIRECTORY, _path || '');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        const filePath = path.join(dir, fileName);
        const image = {
            origin_name: file.name,
            file_name: fileName,
            file_path: filePath,
            file_type: fileType,
            file_size: file.size,
            extension: fileExtension,
        };

        stream_to_file(inputFile,[filePath])

        return Image.create(image).then(image => {
            const result = {
                // ...media.dataValues,
                // uri: `${_path}/${filePath}`,
                no_photo: image.dataValues.no_photo,
                uri: `/${filePath}`,
            }
            return result;
        }).catch(err => {
            console.log(err);
            // createMedia(body, file);
        });
    }
};


const views = {

    createSound: co.wrap(function*(req, res) {

        const files = req.files || {};

        let rows = [];

        for (let file of Object.values(files)) {

            // duration 값 받아오기!
            let duration = yield getDuration(file.path).then(function(duration){
                return new Promise((resolve,reject) => {
                    resolve(duration);
                })
            });

            const sound = yield createMediaSound(req.body, file,duration);

            // upload가 끝난 file 삭제!
            fs.unlinkSync(file.path);

            rows.push(sound);
        }

        let results = JSON.stringify({
            status: 200,
            results: rows,
        });
        return res.json(results);
    }),

    createImage: co.wrap(function*(req, res) {

        const files = req.files || {};

        let rows = [];

        for (let file of Object.values(files)) {

            const image = yield createMediaImage(req.body, file);

            fs.unlinkSync(file.path);

            rows.push(image);
        }

        let results = JSON.stringify({
            status: 200,
            results: rows,
        });
        return res.json(results);
    }),

    delete: co.wrap(function*(req,res, next) {
        const id = req.params.id;
        if (!id){
            req.body = response.error('not found');
            return;
        }
        const media = yield Media.findById(id).then(result => {
            return result;
        });
        media.destroy().then(result => {
           let results = JSON.stringify({
              status: 200,
              results: result,
           });            
            return res.json(results);
        }).catch(err => {
            let results = JSON.stringify({
                status: 1300,
                results: err,
            });            
            if (err.name ==='TypeError'){
                results.results = '데이터가 없음';
            }
            return res.json(results);
        })
        return ;
    }),
};

export default views;
