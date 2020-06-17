
//异步请求,获取页面显示数据

$(document).ready(function(){
	$("#loadingDIV").hide();
	$.showLoading();
	var qrtext=$("#QRTEXT").text();
	
	var ajaxQueryDocument = $.ajax({
		　　url:'/getfile', //请求的URL
		　　timeout : 5000, //超时时间设置，单位毫秒
		　　type : 'get', //请求方式，get或post
		　　data :{'qrtext':qrtext}, //请求所传参数，json格式
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
});