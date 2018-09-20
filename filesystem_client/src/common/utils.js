import moment from 'moment';

export const getCookie = (cname) => {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');

    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return null;
}

export const setCookie = (cname, cvalue, exdays) => {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


export const _getFetch = ((URL) => {
    const URLS =  URL
    return new Promise((resolve, reject) => {
        fetch( URLS, {
            method:"GET",
            headers : {

            }
        })
            .then((res)=> res.json())
            .then((res)=>JSON.parse(res))
            .then((data)=>{
                if(data != null){
                    resolve(data.results);
                } else if(data.status === 1103){
                    console.log(data);
                    resolve([]);
                } else if(data.status === 1116 || data.status === 1117) {
                    alert("로그아웃 되었습니다.")
                    setCookie("token","NOT_HAVE_TOKEN",1);
                    setCookie("uid","NOT_HAVE_UID",1);
                    setCookie("phone","NOT_HAVE_PHONE",1);
                    resolve(data)
                } else {
                    console.log(data);
                    resolve(data)
                };
            })
            .catch((e) => {
                reject(e);
            })
    })
});

export const _putFetch = (URL, body) =>{
    const URLS =  URL;
    return new Promise((resolve, reject)=>{
        fetch( URLS, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })
            .then((res)=>res.json())
            .then((res)=>JSON.parse(res))
            .then((data)=>{
                if(data.status === 200){
                    resolve(data.results);
                } else if(data.status === 1116 || data.status === 1117) {
                    alert("로그아웃 되었습니다.")
                    setCookie("token","NOT_HAVE_TOKEN",1);
                    setCookie("uid","NOT_HAVE_UID",1);
                    setCookie("phone","NOT_HAVE_PHONE",1);
                    resolve(data)
                } else {
                    console.log(data);
                    resolve(data)
                };
            }).catch((e)=>{
            reject(e);
        })
    });
}

export const _postFetch = (URL, body) =>{
    const URLS =  URL;
    return new Promise((resolve, reject)=>{
        fetch( URLS, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then((res)=>res.json())
            .then((res)=>JSON.parse(res))
            .then((data)=>{
                console.log(data);
                if(data.status === 200){
                    resolve(data.results);
                } else if(data.status === 1116 || data.status === 1117) {
                    resolve(data)
                } else if(data.status === 1105) {
                    resolve(data)
                } else {
                    resolve(data);
                }
            })
            .catch((e)=>{
                alert(e);
            reject(e);
        })
    });
}

export const _postImgFetch = (URL, body) =>{
    const URLS =  URL
    alert(body)
    return new Promise((resolve, reject)=>{
        fetch( URLS, {
            method: 'POST',
            body: body,
        })
            .then((res)=>res.json())
            .then((res)=>JSON.parse(res))
            .then((data)=>{
                if(data.status === 200){

                    resolve(data.results);
                } else if(data.status === 1116 || data.status === 1117) {
                    alert("로그아웃 되었습니다.")
                    setCookie("token","NOT_HAVE_TOKEN",1);
                    setCookie("uid","NOT_HAVE_UID",1);
                    setCookie("phone","NOT_HAVE_PHONE",1);
                    resolve(data)
                } else {
                    console.log(data);
                    resolve(data)
                };
            }).catch((e)=>{
            reject(e);
        })
    });
}


export const _deleteFetch = (URL) =>{
    const URLS =  URL
    var token = getCookie("token");
    var no_user = getCookie("uid")
    if(!token){
        token = "NOT_HAVE_TOKEN";
    }
    if(!no_user){
        no_user = "NOT_HAVE_UID";
    }
    return new Promise((resolve, reject)=>{
        fetch( URLS, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token' : token,
                'uid' : no_user
            },
        })
            .then((res)=>res.json())
            .then((res)=>JSON.parse(res))
            .then((data)=>{
                if(data.status === 200){
                    resolve(data);
                } else if(data.status === 1116 || data.status === 1117) {
                    alert("로그아웃 되었습니다.")
                    setCookie("token","NOT_HAVE_TOKEN",1);
                    setCookie("uid","NOT_HAVE_UID",1);
                    setCookie("phone","NOT_HAVE_PHONE",1);
                    resolve(data)
                } else {
                    console.log(data);
                    resolve(data)
                };
            }).catch((e)=>{
            reject(e);
        })
    });
}

export const getWrittenDate = (date) => {
    var nowWrapped = moment(new Date());
    var dateWrapped = moment(date);
    var differenceWrapped = moment(nowWrapped - dateWrapped);
    var value;
    if(differenceWrapped < 60*1000)
        value = '지금';
    else if(differenceWrapped>= 60*1000 && differenceWrapped < 60*60*1000)
        value = parseInt(differenceWrapped%(60*60*1000)/(60*1000)).toString() + '분 전';
    else if(differenceWrapped>= 60*60*1000 && differenceWrapped < 24*60*60*1000)
        value = parseInt(differenceWrapped%(24*60*60*1000)/(60*60*1000)).toString() + "시간 전";
    else if(differenceWrapped>= 24*60*60*1000 && differenceWrapped < 7*24*60*60*1000)
        value = parseInt(differenceWrapped%(7*24*60*60*1000)/(24*60*60*1000)) + "일 전";
    else {
        differenceWrapped += (9*60*60*1000);
        var written = dateWrapped.toDate();
        let year =  date.substring(0,4);
        let month = date.substring(5,7);
        let day = date.substring(8,10);
        if(month.substring(0,1).indexOf(0) !== -1) {
            month = date.substring(6,7);
        }
        if(day.substring(0,1).indexOf(0) !== -1) {
            day = date.substring(9,10);
        }
        value = year + '년 ' + month + '월 ' + day + '일';
    }
    return value;
};


export const getObjectDate = (date) => {
    var nowWrapped = moment(new Date());
    var dateWrapped = moment(date);
    var differenceWrapped = moment(nowWrapped - dateWrapped);
    var value;
    var dateNum;
    var dateStr;
    if(differenceWrapped < 60*1000){
        value = '지금';
        dateStr= "오늘";
    }
    else if(differenceWrapped>= 60*1000 && differenceWrapped < 60*60*1000){
        value = parseInt(differenceWrapped%(60*60*1000)/(60*1000)).toString() + '분 전';
        dateStr= "오늘";
    }
    else if(differenceWrapped>= 60*60*1000 && differenceWrapped < 24*60*60*1000){
        value = parseInt(differenceWrapped%(24*60*60*1000)/(60*60*1000)).toString() + "시간 전";
        dateStr= "오늘";
    }
    else if(differenceWrapped>= 24*60*60*1000 && differenceWrapped < 7*24*60*60*1000){
        value = parseInt(differenceWrapped%(7*24*60*60*1000)/(24*60*60*1000))
        if(value ===1)
            dateStr= "어제";
        else{
            dateStr= value+"일 전"
        }
        value+=+ "일 전";
    }
    else {
        differenceWrapped += (9*60*60*1000);
        var written = dateWrapped.toDate();
        let year =  date.substring(0,4);
        let month = date.substring(5,7);
        let day = date.substring(8,10);
        if(month.substring(0,1).indexOf(0) !== -1) {
            month = date.substring(6,7);
        }
        if(day.substring(0,1).indexOf(0) !== -1) {
            day = date.substring(9,10);
        }
        value = year + '년 ' + month + '월 ' + day + '일';
        dateStr = value;
    }
    var results={
        value: value,
        dateStr: dateStr
    }
    return results;
};
