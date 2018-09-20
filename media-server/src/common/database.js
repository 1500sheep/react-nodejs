import Sequelize from 'sequelize';
import fs from 'fs';
import {
    DB,
    DEBUG,
    INSTALLED_APPS,
    MEDIA_DIRECTORY,
} from './settings';


let sequelize;
if (DEBUG){
    sequelize = new Sequelize('sqlite://db.sqlite', {
        logging: false,
    })
} else {
    sequelize = new Sequelize(DB.database, DB.user, DB.password, {
        logging: false,
        host: DB.host,
        port: DB.port,
        dialect: DB.dialect,
    })
}


const args = process.argv.slice(2);

const importModel = (apps) => {
    for (let app of apps){
        console.log(`${app.toUpperCase()}:`);
        try {
            let models = sequelize.import(`../${app}/models`)
            for (let model of Object.keys(models)){
                models[model].sync();
                console.log(model, '모델 마이그레이션 완료');
            }
        } catch(err) {
            if (err.code !== 'MODULE_NOT_FOUND'){
                throw err;
            }
            console.log(`${app} 앱의 models 모듈을 찾지 못했습니다.`);
        }
        console.log('\n');
    }
    if (!fs.existsSync(MEDIA_DIRECTORY)){
        fs.mkdirSync(MEDIA_DIRECTORY);
    }
}

if (args.length == 1){
    if (args[0] == 'initdb'){
        sequelize.authenticate().then(() => {
            importModel(INSTALLED_APPS);
            console.log('- DB 마이그레이션 완료');
        }).catch(err => {
            console.error('DB 접속 실패: ', err);
        });
    }
}

export default sequelize;
