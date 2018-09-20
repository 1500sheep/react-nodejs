import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {ENCRYPT_KEY, DECRYPTED_DIRECTORY, BEEP_DIRECTORY} from "./settings";

export const stream_to_file = (readPath, writePath_array) => {
    const reader = fs.createReadStream(readPath);

    for(var i=0;i<writePath_array.length;i++){

        var checkEncrypt = writePath_array[i].split('.').pop();

        // 암호용 파일 path 가 올 때 동작!
        if(checkEncrypt == 'enc'){
            // 암호화 using crypto
            stream_to_file_encryption(readPath,writePath_array[i]);
        }else{
            const writer = fs.createWriteStream(writePath_array[i]);
            reader.pipe(writer);

        }
    }
}

// 파일 encrpytion !!
const stream_to_file_encryption = (readPath, writePath) => {
    const reader = fs.createReadStream(readPath);

    // 암호화 알고리즘 aes-256-cbc
    var cipher = crypto.createCipher('aes-256-cbc',ENCRYPT_KEY);

    const writer_encrypted = fs.createWriteStream(writePath);
    reader.pipe(cipher).pipe(writer_encrypted);

    // encryption 끝나면 decryption도 바로 합니다 encrypted directory는 따로 명시하면 됩니다.
    writer_encrypted.on('finish',function(){
        var encrypted_writePath = DECRYPTED_DIRECTORY+'/'+writePath.split('/').pop().substring(0,writePath.length-4);
        stream_to_file_decryption(writePath,encrypted_writePath,encrypted_writePath);
    })


}

// decryption 함수
const stream_to_file_decryption = (readPath, writePath) => {
    const reader = fs.createReadStream(readPath);

    // 암호화 알고리즘 aes-256-cbc
    var cipher = crypto.createDecipher('aes-256-cbc',ENCRYPT_KEY);

    const writer_encrypted = fs.createWriteStream(writePath);
    reader.pipe(cipher).pipe(writer_encrypted);

    // 없어도 됩니당, 확인용
    writer_encrypted.on('finish',function(){
        console.log("Decrypted file written to disk!");
    })


}

// watermark 함수, terminal 창에서 직접 동작하기 위해 child-process -> bash 창 이용!
exports.watermarking = async function(inputPath, outputPath, extension, duration){
    // bash 창에 직접 써야 하기 때문에 절대 경로가 필요!
    var inputFile = path.join(__dirname+'/../../',inputPath || '');
    var outputFile = path.join(__dirname+'/../../',outputPath || '');
    var dir_beep = path.join(__dirname+'/../../',BEEP_DIRECTORY);
    var watermarkFile =dir_beep;

    // 시간 초 별 watermark 경로!
    var beep60 = "/beep";
    var beep120 = "/beep";
    var beep180 = "/beep";

    // 1. npm install ffprobe (first)
    // 2. npm install get-audio-duration

    console.log("audio duration is : ",duration);

    // duration 별로 준비된 watermark 파일 변경 해주면 됩니다.
    if(duration<120){
        watermarkFile+=beep60;
    }else if(duration>=120 && duration <180){
        watermarkFile+=beep120;
    }else{
        watermarkFile+=beep180;
    }

    watermarkFile += "."+extension;


    // 여기서 볼륨 조절, -> etc. 0.5는 소리 반으로 감소
    // watermarkFile= await manipulate_beep(watermarkFile,0.5);

    // 해당 서버에 ffmpeg , npm install
    // terminal command for watermarking
    var watermarkCommand = "ffmpeg -i "+inputFile+" -filter_complex \"amovie="+watermarkFile+":loop=0,asetpts=N/SR/TB[beep]; [0][beep]amix=duration=shortest,volume=2\" "+outputFile;
    console.log(watermarkCommand);

    var terminal = require('child_process').spawn('bash');
    terminal.stdin.write(watermarkCommand+'\n');
    terminal.stdin.end();
}

// watermark용 beep 파일 소리 조절 함수 , volume으로 소리 배수 조절 가능하다
const manipulate_beep = (beepinput,volume)=>{
    return new Promise((resolve => {
        var beepFilename_array = beepinput.split('.');
        var beepExtension = beepFilename_array[beepFilename_array.length-1];
        var beepFilename =beepFilename_array[0]+volume+'.'+beepExtension;

        // terminal command for volume
        var beepCommand = "ffmpeg -i "+beepinput+" -filter:a \"volume="+volume+"\" "+beepFilename;

        var terminal = require('child_process').spawn('bash');
        terminal.stdin.write(beepCommand+'\n');
        terminal.stdin.end();
        resolve(beepFilename);
    }))

}

// 중복된 파일 name 변경 함수, watermark bash 창에서 (,) 일 때 동작을 하지 않아서 (1) -> _1 이렇게 변경함.
export const changeFilename = (filename) =>{
    return new Promise((resolve => {
        // 정규식 표현으로 (\d) 이름 확인하기!

        // var regex = /\(\d+\)/;
        var regex = /_\d+/;
        var filename_array = filename.split('/');
        var directory_name = filename_array[0];

        // directory name 만 따로 분리한다. directory name 중 (1), _1 꼴이 있을 수도 있기 때문에
        for(var i=1;i<filename_array.length-1;i++){
            directory_name += '/'+filename_array[i];
        }
        directory_name += '/';

        var temp_filename_array = filename_array[filename_array.length-1].split('.');
        var temp_filename = temp_filename_array[0];
        var temp_extension = '';

        // enc 파일을 위한!! . 이 두개 있을수도 있다!
        for(var i=1;i<temp_filename_array.length;i++){
            temp_extension+='.'+temp_filename_array[i];
        }

        var found = temp_filename.match(regex);
        var cnt = 0;

        if(!found){
            temp_filename+='_1';
            cnt=1;
        }else{
            cnt = (parseInt(found[0].substring(1,found[0].length-1))+1);
            temp_filename = temp_filename.replace(found[0],'_'+ cnt );
        }

        while(fs.existsSync(directory_name+temp_filename+temp_extension)){
            temp_filename = temp_filename.replace('_'+ cnt ,'_'+ (cnt+1));
            cnt++;
        }

        filename = directory_name+temp_filename+temp_extension;
        resolve(filename);
    }))
}

export const readFiles = (dirname,onFileContent,onError) =>{
    fs.readdir(dirname,function(err,filenames){
        console.log("filenames : ",filenames)
        if(err){
            onError(err);
            return;
        }
        filenames.forEach(function (filename) {
            console.log("이거 나오나?!",filename)
            var filepath = dirname+filename
            var type = '';
            if(fs.lstatSync(filepath).isFile()){
                type = "file";
            }else if(fs.lstatSync(filepath).isDirectory()){
                type = "directory";
            }else{
                type = "something";
            }
            // fs.readFile(dirname+filename,'utf-8',function(err,content){
            //     console.log("여기야 뭐야 ")
            //     if(err){
            //         console.log("err 터졌당",err);
            //         // onError(err);
            //         content = "nothing";
            //     }
            //     onFileContent(filename,content);
            // })
            onFileContent(filename,type);
        })
    })
}















