define(["./public/jquery.min","./gikoo-ajax"],function($, gkTool) {

	//Array contains
	Array.prototype.contains = function(obj) {
		var i = this.length;
		while (i--) {
			if (this[i] === obj) {
				return true;
			}
		}
		return false;
	};

	//获取网页parm
	function getParam (name) {
		var result = (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1];
		return decodeURIComponent(result);
	}

	/*
     * 功能:
     * 1)去除字符串前后所有空格
     * 2)去除字符串中所有空格(包括中间空格,需要设置第2个参数为:g)
     */
    function trim (str, is_global){
        if(str === 'undefined' || str === '' || str === null) {
            return '';
        }
        var result = str.replace(/(^\s+)|(\s+$)/g, "");
        if(is_global.toLowerCase() == "g") {
            result = result.replace(/\s/g, "");
        }
        return result;
    }

	//验证邮箱
	function isEmail(str){
		var reg = /^(?:[a-z\d]+[_\-\+\.]?)*[a-z\d]+@(?:([a-z\d]+\-?)*[a-z\d]+\.)+([a-z]{2,})+$/i;
		return reg.test(str);
	}

	//验证手机号码
	function isPhone(str){
		var reg = /^0?(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/;
		return reg.test(str);
	}

	//验证是否为数字
	function isNumber(str) {
		var reg = /^[0-9]*$/;
		return reg.text(str);
	}

	/*
     * 空字符转换
     */
    function formatStr(str){
        // 数字类型转成字符类型后返回
        if (typeof str === 'number') {
            return '' + str;
        }
        // 布尔类型转成字符'0'或'1'后返回
        // 取值判断时，需调用 parseInt() 方法
        if (typeof str === 'boolean') {
            if (str) {
                return '1';
            } else {
                return '0';
            }
        }
        // 判断是否是空字符串
        if (str === null || str === undefined || str === 'undefined' || str.toLowerCase() === 'null') {
            return '';
        }
        return str;
    }

    /**
     * 计算文字长度
     */
    function getStrLength(str){
        if (str === null) {
            return 0;
        }
        var length = 0;
        for (var i = 0; i < str.length; i++) {
            if ((str.charCodeAt(i) < 0) || (str.charCodeAt(i) > 255))
                length = length + 2;
            else
                length = length + 1;
        }
        return length
    }

    /**
     * 截取文字(包括中文和英文)
     */
    function subString(str, len, hasDot){
        if (str === null) {
            return '';
        }
        var newLength = 0;
        var newStr = '';
        var chineseRegex = /[^\x00-\xff]/g;
        var singleChar = '';
        var strLength = str.replace(chineseRegex, '**').length;
        for(var i = 0; i < strLength; i++) {
            singleChar = str.charAt(i).toString();
            if(singleChar.match(chineseRegex) != null) {
                newLength += 2;
            } else {
                newLength++;
            } if(newLength > len) {
                break;
            }
            newStr += singleChar;
        }

        if(hasDot && strLength > len) {
            newStr += "...";
        }
        return newStr;
    }

    //验证参数是否为空
    function checkRequired(name, val) {
        if (!val || val.length === 0) {
            alert(name + ' 不能为空');
            return false
        }
        return true
    }

    //验证参数是否为-1，表示未做选择
	function checkSelected(name, val) {
		if (val < 0) {
			alert(' 请选择' + name);
			return false
		}
		return true
	}

	//获取已选
	function getCheckedSelected(id,name){
		var $list = $(id).find('input[name='+name+']:checked'),
			c_ids=[];
		$.each($list, function(i, e){
			c_ids.push($(e).attr('aid') && parseInt($(e).attr('aid')));
		});
		return c_ids;
	}

    //时间
    function formatTime(time) {
        if(time < 10)
            return '0' + time;
        else
            return time;
    }

    /**
	* 2015-12-25  =>
	*	0 =>2015年12月 
	* 	1 =>2015年12月25日
    **/
    function DateFormatDay(time,type){
        if(time) {
            var date = time.split('-');
            if(type)
                return date[0]+'年'+date[1]+'月';
            else
                return date[0]+'年'+date[1]+'月'+date[2]+'日';

        } else {
            return '';
        }
    }

    //2016-3-20 13:00:00 => 2016-3-20
    function DateFormatToDays(time){
        if(time !== null && time !== undefined) {
            if(time.indexOf('T') > 0){
                return time.split('T')[0];
            }
            return time.split(' ')[0];
        } else {
            return '';
        }
    }
    

	//七牛上传图片
    function QiNiuUpFiles(token, btn, container, successCallback) {
        Qiniu.uploader({
            runtimes: 'html5,flash,html4', //上传模式,依次退化
            browse_button: btn, //上传选择的点选按钮，**必需**
            uptoken: token, //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
            unique_names: true, // 默认 false，key为文件名。若开启该选项，SDK为自动生成上传成功后的key（文件名）。
            save_key: true, // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK会忽略对key的处理
            domain: 'http://iap-bucket.qiniudn.com/', //bucket 域名，下载资源时用到，**必需**
            container: container, //上传区域DOM ID，默认是browser_button的父元素，
            max_file_size: '10mb', //最大文件体积限制
            flash_swf_url: '../js/plugin/plupload/Moxie.swf', //引入flash,相对路径
            max_retries: 0, //上传失败最大重试次数
            dragdrop: true, //开启可拖曳上传
            chunk_size: '4mb', //分块上传时，每片的体积
            auto_start: true, //选择文件后自动上传，若关闭需要自己绑定事件触发上传
            multi_selection: false,
            init: {
                'FilesAdded': function(up, files) {

                },
                'FileRemoved': function(up, files) {

                },
                'BeforeUpload': function(up, file) {
                    // 每个文件上传前,处理相关的事情
                    // $.alert(filess.length);

                },
                'UploadProgress': function(up, file) {
                    // 每个文件上传时,处理相关的事情
                },
                'FileUploaded': function(up, file, info) {
                    // 每个文件上传成功后,处理相关的事情
                    // 其中 info 是文件上传成功后，服务端返回的json，形式如
                    // {
                    //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                    //    "key": "gogopher.jpg"
                    //  }
                    successCallback && successCallback(up,info);
                },
                'Error': function(up, err, errTip) {
                    //上传出错时,处理相关的事情
                    console.log('处理相关的事情')
                },
                'UploadComplete': function() {
                    //队列文件处理完毕后,处理相关的事情
                },
                'Key': function(up, file) {
                    // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                    // 该配置必须要在 unique_names: false , save_key: false 时才生效

                    var key = "";
                    // do something with key here
                    return key
                }
            }
        });
    }

	//清除cookie
	function clearCookie(){
		gkTool.removeItem("GIKOOUN");
		gkTool.removeItem("GIKOO-USR");
		gkTool.removeItem("token");
	}

	$(document).ready(function() {

		var userInfo = gkTool.getItem('GIKOO-USR') && JSON.parse(gkTool.getItem('GIKOO-USR'));
		//顶部菜单栏
		userInfo && userInfo.icon && $('#personIcon').attr('src',userInfo.icon);
		$('#personName').text(userInfo && userInfo.account_name ? userInfo.account_name : '匿名');


		//登出
		$(".person .logo-out").click(function() {
			gkTool.ajax('user/logout/', 'post', null, function(data) {
				clearCookie();
				window.location.href = "login.html";
			}, function() {});
		});
	});


	return {
		getParam : getParam,
		trim : trim,
		isEmail : isEmail,
		isPhone : isPhone,
		isNumber : isNumber,
		formatStr : formatStr,
		getStrLength : getStrLength,
		subString : subString,
		checkRequired : checkRequired,
		checkSelected : checkSelected,
		formatTime : formatTime,
		getCheckedSelected : getCheckedSelected,
		DateFormatDay : DateFormatDay,
		DateFormatToDays : DateFormatToDays,
		QiNiuUpFiles : QiNiuUpFiles
	}
});