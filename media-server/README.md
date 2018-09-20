## Media Server

### File Encryption



### Encryption

- 허가된 이 외에는 읽을 수 없도록 정보를 부호화 하고 부호화 할 때 암호화 알고리즘을 사용
- 키의 갯수 : 1key :  비밀키(대칭키) / 2key : 공개키(비대칭 키)
- 데이터의 처리 단위 : stream, block
- 원본 복호화 여부 : 단방향, 양방향
- 해시 함수(Hash Function)





### Sound File Upload

1. 파일 업로드 할 때 저장 경로 Sound 와 Image 구분, **multiparty** 에 의해 originalfilename로 저장되지 않고 filename이 변경된체로 저장된다.

   ```js
   var multipartMiddlewareSound = multipart({uploadDir:"files/original_sound/"});
   var multipartMiddlewareImage = multipart({uploadDir:"files/original_image/"});

   router.post('/sound/upload', multipartMiddlewareSound, views.createSound);

   router.post('/img/upload', multipartMiddlewareImage, views.createImage);

   ```


2. **multipart()** 로 read.

3. **views.createSound** -> **createMedia()** 로 audio file encrypt & watermarking & insert data into database

4. **watermarking** : terminal에 써야 하기 때문에 절대 경로가 필요하며 **ffmpeg** 가 global install 되 있어야 한다. [OS 별 설치 방법](https://github.com/adaptlearning/adapt_authoring/wiki/Installing-FFmpeg)

   ```js
   export const watermarking = (inputPath, outputPath, extension) => {
     ...
     var terminal = require('child_process').spawn('bash');
       terminal.stdin.write(watermarkCommand+'\n');
       terminal.stdin.end();
   }
   ```

5. **encryption** : *crypto* 사용  *fs.createReadStream, fs.createWriteStream*  이 필요하기 때문에 함수로 분리하지 않고 대칭형 key만 *settings.js*에 저장 (key 값 관련해서 추후 작업 필요, DB 저장 등)

   ```js
   // createMediaSound에 포함, 분리 하지 않음
   var cipher = crypto.createCipher('aes-256-cbc',ENCRYPT_KEY);
   const reader = fs.createReadStream(file.path);
   const writer_encrypted =fs.createWriteStream(filePath_encrypted+'.enc');
   reader.pipe(writer_original);
   reader.pipe(cipher).pipe(writer_encrypted);
   ```

6. Database에 파일 정보 저장

7. audio duration check : **ffprobe** (first), **get-audio-duration** 

   > npm install ffprobe
   >
   > npm install get-audio-duration

   ```js
   getDuration(inputFile).then(function(duration){
           console.log("audio duration is : ",duration);
           if(duration<120){
               watermarkFile+="/../../media/sound/beep/beep";
           }else if(duration>=120 && duration <180){
               watermarkFile+="/../../media/sound/beep/beep";
           }else{
               watermarkFile+="/../../media/sound/beep/beep";
           }
     // 여기서 watermark 같이 진행!
     ...
   }
   ```

