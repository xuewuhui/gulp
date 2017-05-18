define(["./public/jquery.min"],function($) {
	var API_PREFIX = '/api/v1/';
	if(window.location.href.indexOf('localhost') > -1 || window.location.href.indexOf('192.168.1.212') > -1)
		API_PREFIX = 'http://consultant.mps5dev.gikoo.cn/api/v1/';

	//写cookies
	var setItem = function(name, value) {
		var Days = 36500;
		var exp = new Date();
		exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
		document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString()+";path=/";
	};

	//读取cookies
	var getItem = function(name) {
		var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
		if (arr = document.cookie.match(reg)) {
			return unescape(arr[2]);
		} else {
			return null;
		}
	};

	//删除cookies
	var removeItem = function(name) {
		var exp = new Date();
		exp.setTime(exp.getTime() - 1);
		var cval = getItem(name);
		if (cval != null) {
			document.cookie = name + "=" + cval + ";path=/;expires=" + exp.toGMTString();
		}
	};

	//添加token
	var token = getItem('token');
	/*if(!token && window.location.href.indexOf('/html/login')<0){
		removeItem("GIKOOUN");
		removeItem("GIKOO-USR");
		removeItem("token");
		window.location.href = './login.html';
	}*/

	//设置ajax请求头部
	$.ajaxSetup({
		crossDomain: true,
		beforeSend: function(xhr, settings) {
			// if(csrfapptoken != undefined){
			// 	xhr.setRequestHeader("Authorization", "Token " + csrfapptoken);
			// }

			// if (!csrfSafeMethod(settings.type))
			//          {
			//              xhr.setRequestHeader("X-CSRFToken", csrftoken);
			//          }
			if (token != undefined) {
				//xhr.setRequestHeader("token", token);
				xhr.setRequestHeader("Authorization", "Token " + token);
			}
		}
	});

	//下载Excel
	$.gikooDownload = function(path,method,data,successCallback,url_prefix){
		var url= API_PREFIX + path;
		if(url_prefix)
			url = url_prefix + path;

		url+= ((path.indexOf('?')!=-1)?'&':'?');
		url+= ('date='+ new Date().getTime());

		// 把参数组装成 form的  input
	    jQuery.each(data,function(key,value) {
	    	url+= ('&'+key+'='+encodeURIComponent(value));
		});

	    // 发送请求
	    window.open(url);
	};

	//ajax请求
	var gikooRequest = function(path, type, data, successCallback, errorCallback, async, url_prefix,isLoading) {

		var $loading = $(".loading");
		if(isLoading || isLoading == null || isLoading == undefined){
			if (!$loading.length) {
				$loading = $('<div class="loading"></div>');
				$("body").append($loading);
			}
			$loading.show();
		}

		var api_prefix = API_PREFIX;
		if (url_prefix && url_prefix != null)
			api_prefix = url_prefix;
		if (type.toLowerCase() == "get") {
			if (data != null) {
				data.gk_ajax_timestamp = Date.parse(new Date());
			} else {
				data = {
					"timeStamps": Date.parse(new Date())
				};
			}
		}

		if (async == null)
			async = true;
		$.ajax({
			url: api_prefix + path,
			type: type,
			data: data,
			contentType: "application/json",
			dataType: "json",
			async: async,
			//timeout : 1000,
			success: function(data) {
				$loading.hide();
				if (successCallback != null) {
					successCallback(data);
				}
			},
			error: function(xhr, type, exception) {
				if (errorCallback) {
					$loading.hide();
					var ret = errorCallback(xhr, type, exception, data);
					if (ret == true) return;
				}
			}
		});
	};

	//一般ajax请求
	var request = function(path,type,data,successCallback, errorCallback){

		if (type.toLowerCase() == "get"){
			if(data != null){
				data.gk_ajax_timestamp = Date.parse(new Date());
			}else{
				data = {"timeStamps":Date.parse(new Date())};
			}
		}

		$.ajax({
			url: path,
			dataType: 'json',
			type: type,
			data: data,
			contentType:"application/json",
			success: function (res) {
				successCallback && successCallback(res);
			},
			error: function (res) {
				errorCallback && errorCallback(res);
			}
		})
	}

	

	return {
		ajax: gikooRequest,
		request : request,
		setItem: setItem,
		getItem: getItem,
		removeItem: removeItem
	}
});