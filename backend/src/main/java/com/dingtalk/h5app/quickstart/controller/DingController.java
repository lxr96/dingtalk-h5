package com.dingtalk.h5app.quickstart.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;

@Controller
public class DingController {
	
	@GetMapping("/index")
	String index() {
		return "index";
	}
	
	@RequestMapping("/success")
	@ResponseBody
	public String success(@RequestParam String name) {
		System.out.println("扫描成功，二维码内容:"+name);
		return "success:"+name;
	}
	
	@RequestMapping(value="/result",method=RequestMethod.GET)
	public String getResult(HttpServletRequest request,@RequestParam String text) {
		request.setAttribute("qrtext", text);
		System.out.println("text:"+text );
		return "result4";
	}
	
	/** 
		* @content 模拟二维码文件查询接口
		* @author LXR
		* @data 2020年6月15日 上午11:37:04
		* @param text
		* @return
	 * @throws InterruptedException 
	*/
	@ResponseBody
	@RequestMapping(value = "/getfile",method = RequestMethod.GET)
	public JSONObject getFileInforman(@RequestParam String qrtext) throws InterruptedException {
		System.out.println("二维码文件查询接口接收参数:"+qrtext);
		//模拟返回JSON数据
		String jsonStr ="{\"status\":\"warn\",\"message\":\"扫描最新文件\",\"content\":[{\"文件编码\":\"TS-SSDFS-123\"},{\"版本\":\"A\"},{\"文件编码\":\"TS-SSDFS-123\"},{\"版本\":\"A\"},{\"文件编码\":\"TS-SSDFS-123\"}]}";
		JSONObject jsonObject = JSONObject.parseObject(jsonStr);
		Thread.sleep(1000);
		System.out.println("查询结果:"+jsonObject);
		return jsonObject;
	}

}
