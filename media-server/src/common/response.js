const response = (status, results, error) => {
    return JSON.stringify({
        status  : status,
        results : results,
        error   : error,
    });
};
const success = (results) => {
    //console.log(results);
    let status = 200;
    if (!results){
        return error('not found');
    }
    return response(status, results);
};
const error = (error) => {
    //console.log(error);
    let status = 1100;
    let results = '에러: ';
    if (error === 'not_enough_body'){
        status = 1101;
        results += 'body의 data 값이 부족합니다.';
    } else if (error === 'not_enough_query'){
        status = 1102;
        results += '쿼리 전달값이 부족합니다. ';
    } else if (error === 'no_data'){
        status = 1103;
        results += '데이터를 찾지 못했습니다.';
    } else if (error === 'no_code'){
        status = 1104;
        results += '잘못된 code입니다. ';
    } else if (error === 'not_created'){
        status = 1105;
        results += '데이터 생성 실패';
    } else if (error === 'unique_violation'){
        status = 1106;
        results += '이미 가입된 아이디 입니다.';
    } else if (error === 'TokenExpiredError' || error === 'JsonWebTokenError'){
        status = 1107;
        results += '아이디 없습니다.';
    } else if (error === 'not_matched_pw'){
        status = 1108;
        results += '비밀번호가 일치하지 않습니다.';
    } else if (error === 'dont_affect_rows'){
        status = 1109;
        results += '업데이트 실패, 업데이트될 데이터가 존재하지 않습니다 ';
    } else if (error === 'cant_token_update'){
        status = 1110;
        results += '토큰 업데이트 실패, 다시 로그인을 진행하세요 ';        
    } else if (error === 'cant_load_user'){
        status = 1111;
        results += '유저 정보를 불러오는데 실패하였습니다. ';        
    } else if (error === 'user_cant_create'){
        status = 1112;
        results += '유저 생성에 실패 하였습니다.';         
    } else if (error === 'cant_delete'){
        status = 1113;
        results += '삭제에 실패하였습니다.';   
    } else if (error === 'cant_load_user'){
    } else if (error === 'cant_load_user'){
    } else{
      results += '알 수 없는 에러입니다. 관리자에게 문의해주세요.';  
    }
    console.log('status: ' + status,'result: ' + results);
    return response(status, results);
};

const sqlError = (error)=>{
    let status  = 1000;
    let results = 'DB Error: ';
    let msg     = error.msg;

    switch(error.code){
        case 'ETIMEDOUT' :
        status   = 1001;
        results += 'DB연결에 실패하였습니다. 연결정보를 확인하세요';
        break;
        case 'ER_SP_UNDECLARED_VAR' :
        status = 1002;
        results += 'Query에 불명확한 값이 전달되었습니다. ';
        break;
        case 'ENETUNREACH' :
        status = 1003;
        results += 'DB연결에 실패하였습니다. ';
        break;
        case 'PROTOCOL_SEQUENCE_TIMEOUT' :
        status = 1004;
        results += 'DB연결에 실패하였습니다. ';
        break;
        case 'ER_BAD_FIELD_ERROR' :
        status = 1005;
        results += '테이블에 해당 필드가 없습니다. 전달변수 또는 테이블 명을 확인 하세요. ';
        break;
        case 'ER_NO_SUCH_TABLE' :
        status = 1005;
        results += '해당 테이블을 찾을수 없습니다. ';
        break;    
        case 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD' :
        status = 1006;
        results += '해당 컬럼에 잘못된 타입이 전달되었씁니다.';
        break;
        case 'ER_NO_DEFAULT_FOR_FIELD' :
        status = 1007;
        results += '디폴트 값이 설정 안됀곳에 값을 넣지 않았습니다 ';
        break;
        case 'ERROR' :
        status = 1000;
        results += '전달 변수명을 확인하세요';
        break;
        case 'ERROR' :
        status = 1000;
        results += '전달 변수명을 확인하세요';
        break;
        case 'ERROR' :
        status = 1000;
        results += '전달 변수명을 확인하세요';
        break;
        case 'ERROR' :
        status = 1000;
        results += '전달 변수명을 확인하세요';
        break;
        case 'ERROR' :
        status = 1000;
        results += '전달 변수명을 확인하세요';
        break;


                                                      
        default:
        results += '알수 없는 DB에러입니다. 관리자에게 문의하세요.';
    }

    console.log('code: '+error.code +' status: ' + status, 'msg' + error.msg);
    return response(status, results, msg);
}

export default {
    success: success,
    error: error,
    sqlError: sqlError,
};