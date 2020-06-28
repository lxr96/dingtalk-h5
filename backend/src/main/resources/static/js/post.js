//调用微信扫一扫功能所在的页面
var url = window.location.href;
var HOST ="http://"+window.location.host;
//服务端提供的接口。HOST是服务器的地址，在项目中定义为全局变量；
var projectName ="/barcode";
var urlConfig = HOST + projectName + "/config";
var corpId ="ding46db3d79dc8a5f50bc961a6cb783455b";
console.log('钉钉域名安全验证：'+urlConfig);
    //ajax注入权限验证
    $.ajax({
        url: urlConfig,
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
    
//通过ready接口处理成功验证
    dd.ready(function() {
        // dd.ready参数为回调函数，在环境准备就绪时触发，jsapi的调用需要保证在该回调函数触发后调用，否则无效。    	
    	var corpId ='ding46db3d79dc8a5f50bc961a6cb783455b';
    	
    	var jobNumber="";
    	dd.runtime.permission.requestAuthCode({
            corpId : corpId,
            onSuccess : function(result) {
//            	console.log('code:'+result.code);
            	//将code 发往后台处理
                $.ajax({
                    url: projectName+'/login',
                    type:"POST",
                    data: {"authCode":result.code},
                    dataType:'json',
                    success: function (userInfo) {
                    	//alert("user:"+userInfo.result.name+userInfo.result.jobNumber);
                    	jobNumber=userInfo.result.jobNumber;
                    },
                    error: function (xhr, errorType, error) {
                        logger.e(errorType + ', ' + error);
                    }
                });
                
    　　　　
            },
            onFail : function(err) {
               // alert('出错了, ' + err);
            }
        });
    	
    	
    	dd.biz.util.scan({
            type: "qrCode" , // type 为 all、qrCode、barCode，默认是all。
            onSuccess: function(data) {
            	console.log('scanContent:', data.text);
            	var result = data.text; // 当needResult 为 1 时，扫码返回的结果
            	var user = jobNumber;
            	//alert("请求二维码内容："+result);
//                window.location.href = HOST+"/barcode/result?text="+result+"&user="+user;
            	//alert("user:"+user);
            	if(user==""||user==null){//未关注对应钉钉公司处理
            		$("#tips").text("请关注中广核钉钉");
            		$(".weui-msg__icon-area").append("<i class='weui-icon_msg-primary weui-icon-warn'></i>");
            	}else{
                	$("#loadingDIV").hide();
                	$.showLoading();
                	var ajaxQueryDocument = $.ajax({
                		　　url:'/barcode/getfile', //请求的URL
                		　　timeout : 5000, //超时时间设置，单位毫秒
                		　　type : 'post', //请求方式，get或post
                		　　data :{'text':result,'user':user}, //请求所传参数，json格式
                		 　　dataType:'json',//返回的数据格式
                		 　　success:function(res){ //请求成功的回调函数
                			 $.hideLoading();
                		 	 $("#loadingDIV").show();
                			 
                			 var content = res.content;//遍历内容key,value
                			 var status = res.status;//图标
                			 var message = res.message;//提示信息
                		 		
                		 		$.each(content,function(index,item){
                	        		$.each(item,function(key,value){
                	            	     //console.log(key+"..."+value);
                	            	     var content = "<div class='weui-cell'><div class='weui-cell__bd'><p>"+key+"</p></div><div class='weui-cell__ft' ><p>"+value+"</p></div></div>";
                	            	     $(".page-hd").append(content);
                	            	});
                	        	});
                		 		if(status=='clear'){
                		 			$(".weui-msg__icon-area").append("<i class='weui-icon_msg weui-icon-success-ts'></i>");
                	        	}else if(status=='remind'){
                	        		$(".weui-msg__icon-area").append("<i class='weui-icon_msg-primary weui-icon-warn'></i>");
                	        	}else{
                	        		$(".weui-msg__icon-area").append("<i class='weui-icon_msg weui-icon-error-ts'></i>");
                	        	}
                	        	$("#tips").text(message);
                		　　},
                		　　complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                		 　　　　if(status=='timeout'){//超时,status还有success,error等值的情况
                		 　　　　　 ajaxQueryDocument.abort();
                		  		  $.hideLoading();
                		  		  $("#loadingDIV").show();
                		  		  $(".weui-msg__icon-area").append("<i class='weui-icon_msg weui-icon-error-ts'></i>");	
                		  		  $("#tips").text("超时");
                		　　　　}
                		　　}
                		 });
            	}
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
        //alert('dd error: ' + JSON.stringify(error));
 });