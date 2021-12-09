import * as https from 'https';
import * as querystring from 'querystring';
import md5 = require('md5');
import {appID, key} from './private';

type ErrorMap ={
  [k:string]:string
}
const errorMap:ErrorMap={
  52000:'成功',
  52001:'请求超时',
  52002 :'系统错误 ',
  52003:'未授权用户',
  54000 :'必填参数为空 ',
  54001 :'签名错误 ',
  54003:'访问频率受限 ',
  54004 :'账户余额不足 ',
  54005  :'长query请求频繁 ',
  58000  :'客户端IP非法  ',
  58001  :'译文语言方向不支持 ',
  58002  :'服务当前已关闭 ',
  90107  :'认证未通过或未生效 ',

}
const translate =(word:string)=>{


  const salt= Math.random()
  const sign = md5(appID + word + salt + key)
  let from,to
  if(/[a-zA-Z]/.test(word[0])){
    from='en'
    to ='zh'
  }else{
    from='zh'
    to = 'en'
  }
  const query:string = querystring.stringify({ //获取查询参数
    q:word,
    appid:appID ,
    from,
    to,
    salt,
    sign
  })
  const options = { // 获取请求
    hostname: 'api.fanyi.baidu.com',
    port: 443,
    path: '/api/trans/vip/translate?' + query,
    method: 'GET'
  };

  const request = https.request(options, (response) => {
    //获取响应体的数据
     const chunks:Buffer[] =[]
    response.on('data', (chunk:Buffer) => {//获取响应体的数据
      chunks.push(chunk)
    });
     response.on('end',()=>{ //获取响应体的数据
       const string=Buffer.concat(chunks).toString()

       type TranslateResult ={
         from:string,
         to:string,
         trans_result:{src:string,dst:string}[]
         error_code?:string
         error_msg?:string

       }
       const object:TranslateResult =JSON.parse(string)
       if(object.error_code){
         console.error(errorMap[object.error_code] || object.error_msg)
         process.exit(2) //退出进程
       }else {
         object.trans_result.map(obj=>
           console.log(obj.dst)
         )
         process.exit(0)
       }

     })
  });

  request.on('error', (e) => {
    console.error(e);
  });
  request.end();
}

export default translate