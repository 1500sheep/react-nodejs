export default (sequelize, DataTypes) => {
    let models = {};

    models.Image = sequelize.define('IMAGE', {
        no_photo: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        origin_name: {type: DataTypes.STRING(100)},
        file_name: {
            type: DataTypes.STRING(100),
            unique: true,
        },
        file_path: {type: DataTypes.STRING(150)},
        file_type: {type: DataTypes.STRING(20)},
        file_size: {type: DataTypes.INTEGER},
        extension: {type: DataTypes.STRING(20)},
    });

    models.Sound = sequelize.define('SOUND', {
        no_audio: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        origin_name: {type: DataTypes.STRING(100)},
        file_name: {
            type: DataTypes.STRING(100),
            unique: true,
        },
        origin_file_path: {type: DataTypes.STRING(150)},
        watermark_file_path: {type: DataTypes.STRING(150)},
        encrypt_file_path: {type: DataTypes.STRING(150)},
        file_type: {type: DataTypes.STRING(20)},
        file_size: {type: DataTypes.INTEGER},
        extension: {type: DataTypes.STRING(20)},
        duration: {type:DataTypes.FLOAT}
    });

    return models;
}
