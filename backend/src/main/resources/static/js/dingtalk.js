//调用微信扫一扫功能所在的页面
var url = window.location.href;
var HOST ="http://"+window.location.host;
//服务端提供的接口。HOST是服务器的地址，在项目中定义为全局变量；
var url11 = HOST + "/config";
var corpId ="ding46db3d79dc8a5f50bc961a6cb783455b";
console.log('文字信息'+url11);
    //ajax注入权限验证
    $.ajax({
        url: url11,
        type:"POST",
        data: {"url":url},
        dataType:'json',
        complete: function(XMLHttpRequest, textStatus){
              
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            alert("发生错误："+errorThrown);
        },
        success: function(res){
        	var agentId = res.agentId;
        	corpId = res.corpId;
        	var timeStamp = res.timeStamp;
        	var nonceStr = res.nonceStr;
        	var signature = res.signature;
   
            dd.config({
                agentId: agentId, // 必填，微应用ID
                corpId: corpId,//必填，企业ID
                timeStamp: timeStamp, // 必填，生成签名的时间戳
                nonceStr: nonceStr, // 必填，生成签名的随机串
                signature: signature, // 必填，签名
                type:0,   //选填。0表示微应用的jsapi,1表示服务窗的jsapi；不填默认为0。该参数从dingtalk.js的0.8.3版本开始支持
                jsApiList : [
                    'biz.util.scan',
                    'runtime.permission.requestAuthCode',
                ] // 必填，需要使用的jsapi列表，注意：不要带dd。
            });
        }
    });
    
    /*
    dd.runtime.permission.requestAuthCode({
        corpId: corpId,
        onSuccess: function(result) {
        /*{
            code: 'hYLK98jkf0m' //string authCode
        }*//*
        	//alert(result.code);
        	alert('requestAuthCode success');
        	$.ajax({
                url: '/login',
                type:"POST",
                data: {"authCode":result.code},
                dataType:'json',
                success: function (userInfo) {
                	userInfo.userid;
                	userInfo.name;
                	alert(userInfo.name);
                	console.log('Total Price:', userInfo.userid+userInfo.name)
                },
                error: function (xhr, errorType, error) {
                    logger.e(errorType + ', ' + error);
                }
            });
        },
        onFail : function(err) {
        	alert('requestAuthCode fail: ' + JSON.stringify(error));
        }
  
    });*/
//通过ready接口处理成功验证

    dd.ready(function() {
        // dd.ready参数为回调函数，在环境准备就绪时触发，jsapi的调用需要保证在该回调函数触发后调用，否则无效。    	
    	var corpId ='ding46db3d79dc8a5f50bc961a6cb783455b';
    	
    	var jobNumber="";
    	dd.runtime.permission.requestAuthCode({
            corpId : corpId,
            onSuccess : function(result) {
//            	alert("corpId:"+corpId);
//                var code = result.code;
//                alert("code:"+code);
            	console.log('code:'+result.code);
            	//将code 发往后台处理
                $.ajax({
                    url: '/login',
                    type:"POST",
                    data: {"authCode":result.code},
                    dataType:'json',
                    success: function (userInfo) {
                    	alert("user:"+userInfo.result.name+userInfo.result.jobNumber);
                    	jobNumber=userInfo.result.jobNumber;
                    },
                    error: function (xhr, errorType, error) {
                        logger.e(errorType + ', ' + error);
                    }
                });
                
    　　　　
            },
            onFail : function(err) {
                alert('出错了, ' + err);
            }
        });
    	
    	
    	dd.biz.util.scan({
            type: "qrCode" , // type 为 all、qrCode、barCode，默认是all。
            onSuccess: function(data) {
            //onSuccess将在扫码成功之后回调
              /* data结构
                { 'text': String}
              */
            	console.log('scanContent:', data.text);
            	//alert("userLogInfo:"+jobNumber);
            	var result = data.text; // 当needResult 为 1 时，扫码返回的结果
            	var user = jobNumber;
                window.location.href = HOST+"/result?text="+data.text+"&user="+user;
            },
           onFail : function(err) {
           }
        });
    });
    
    dd.error(function(error){
        /**
         {
            errorMessage:"错误信息",// errorMessage 信息会展示出钉钉服务端生成签名使用的参数，请和您生成签名的参数作对比，找出错误的参数
            errorCode: "错误码"
         }
        **/
        alert('dd error: ' + JSON.stringify(error));
 });