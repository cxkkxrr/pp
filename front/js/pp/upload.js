;(function(){
	ppClass.Upload = function(config){
		var settings = {
			flash_url : PPG.imgBaseUrl + 'swf/swfupload.swf',
			flash9_url : PPG.imgBaseUrl + 'swf/swfupload_fp9.swf',
			upload_url: PPG.apiBaseUrl + 'appmarket/upload.do?action=uploadFile',
			post_params: {
				'type': config.type || '0', //0为图片，否则为压缩包
				'callback': 'callback'
			},
			file_size_limit : config.fileSizeLimit, // "1MB",
			file_types : config.fileTypes, //"*.jpg;*.jpeg;*.gif;*.png;*.bmp",
			file_types_description : config.fileTypesDescription, //"不超过1MB的文件",
			file_upload_limit : 0, //这里限制的是一个SWFUpload实例控制上传成功的文件总数。
			file_queue_limit : 1,
			custom_settings : {
				totalUploadNum : 0,
				fileUploadLimit : 1, //允许上传文件数
				progressTarget : config.progressTarget, //"newProblem_uploadProcess",
				//uploadTip_progress: config.uploadTip_progress, //'上传中，请稍候... {percent}',
				//uploadTip_success:'上传完成',
				//uploadTip_error:'上传失败',
				swfUploadLoadedCallback: config.swfUploadLoadedCallback,
				preCheckCallback: config.preCheckCallback,
				uploadStartCallback: config.uploadStartCallback,
				uploadSuccessCallback : config.uploadSuccessCallback,
				uploadErrorCallback : config.uploadErrorCallback,
				progressTemplete: '<div class="process_out" id="{fileId}"><div class="process_in" style="width:0px;"></div></div><div class="cancle" id="{fileId}_del"><span class="percent"></span> <a href="javascript:;" style="color:#f00;">取消</a></div>',
				loadIndex: 0, //解决某些浏览器重复加载，导致fileId相同的问题
				fileIndex: 0
			},
			debug: false,

			// Button Settings
			button_image_url : PPG.imgBaseUrl + "img/upload_btn.png",
			button_placeholder_id : config.buttonPlaceholderId, //"newProblem_uploadFlash",
			button_width: 75,
			button_height: 26,
			
			// The event handler functions are defined in handlers.js
			swfupload_preload_handler : pp_swfUploadPreLoad, //swfUpload加载前
			swfupload_load_failed_handler : pp_swfUploadLoadFailed,  //swfUpload加载失败
			swfupload_loaded_handler : pp_swfUploadLoaded, //swfUpload加载完成
			file_dialog_complete_handler : pp_fileDialogComplete,
			file_queued_handler : pp_fileQueued,
			file_queue_error_handler : pp_fileQueueError,
			
			upload_start_handler : pp_uploadStart,
			upload_progress_handler : pp_uploadProgress,
			upload_error_handler : pp_uploadError,
			upload_success_handler : pp_uploadSuccess,
			upload_complete_handler : pp_uploadComplete,
			queue_complete_handler : pp_queueComplete	// Queue plugin event
		};

		this.swfObj;
		//setTimeout(function(){
		if(!this.swfObj){
			this.swfObj = new SWFUpload(settings);
		}
		//},500);/*延时加载*/
	}
})();






/**************swfUpload Handlers*Start****************/
function pp_swfUploadPreLoad() {
	var self = this;
	var loading = function () {
		var longLoad = function () {
			alert("上传组件加载失败");
		};
		this.customSettings.loadingTimeout = setTimeout(function () {
				longLoad.call(self)
			},
			15 * 1000
		);
	};
	loading.call(self);
	/*this.customSettings.loadingTimeout = setTimeout(function () {
			loading.call(self);
		},
		1*1000
	);*/
}
function pp_swfUploadLoaded() {
	//alert("上传组件加载成功");
	clearTimeout(this.customSettings.loadingTimeout);

	this.customSettings.loadIndex++;  //用于解决某些浏览器display=block|none时重复加载，导致fileId重复的问题
	if(this.customSettings.totalUploadNum >= this.customSettings.fileUploadLimit){
		this.setButtonDisabled(true);
	}

	(typeof(this.customSettings.swfUploadLoadedCallback) == 'function') && this.customSettings.swfUploadLoadedCallback();
}
function pp_swfUploadLoadFailed() {
	clearTimeout(this.customSettings.loadingTimeout);
	alert("上传组件加载失败，请安装或更新您的Flash Player");
}
function pp_fileQueued(file) {
	try {
		/*file
		uploadtype=0
		name=ss.jpg
		size=670374
		creationdate=Fri Dec 21 2012 15:14:02 GMT+0800 (中国标准时间)
		modificationdate=Mon Dec 24 2012 16:53:39 GMT+0800 (中国标准时间)
		filestatus=-1
		index=0
		id=SWFUpload_0_0
		type=.jpg
		post=[object Object]
		*/
		/*if(!$.login.isLogined()){
			this.cancelUpload(file.id, false);
			noLoginAction(); 
			return false;
		}*/

		this.customSettings.totalUploadNum ++;
		this.customSettings.fileIndex ++;
		var self = this;
		var file_id = file.id;
		var file_dom_id = file_id + '_' + this.customSettings.loadIndex;

		if(this.customSettings.totalUploadNum <= this.customSettings.fileUploadLimit){
			$('#'+this.customSettings.progressTarget).append( this.customSettings.progressTemplete.replace(/{fileId}/gi, file_dom_id).replace(/{fileIndex}/gi, this.customSettings.fileIndex) );
			$('#'+file_dom_id+'_del').find('a').click(function(){
				pp_deleteUpload(file_id, file_dom_id, self);
			});
		}

		if(this.customSettings.totalUploadNum >= this.customSettings.fileUploadLimit){
			this.setButtonDisabled(true);
		}

		if(this.customSettings.totalUploadNum >= this.customSettings.fileUploadLimit+1){
			this.customSettings.fileIndex --;
			pp_deleteUpload(file_id, file_dom_id, self);
		}

		if(typeof(this.customSettings.preCheckCallback) == 'function'){
			if(this.customSettings.preCheckCallback() === false){
				pp_deleteUpload(file_id, file_dom_id, self);
			}
		}
	} catch (ex) {
		//this.debug(ex);
	}
}
function pp_deleteUpload(file_id, file_dom_id, swfUploadInstance){
	swfUploadInstance.cancelUpload(file_id, false);
	swfUploadInstance.customSettings.totalUploadNum --;
	if(swfUploadInstance.customSettings.totalUploadNum < 0){
		swfUploadInstance.customSettings.totalUploadNum = 0;
	}
	if(swfUploadInstance.customSettings.totalUploadNum < swfUploadInstance.customSettings.fileUploadLimit){
		swfUploadInstance.setButtonDisabled(false);
	}
	$('#'+file_dom_id).remove();//"取消上传并删除";
	$('#'+file_dom_id+'_del').remove();
}
function pp_fileQueueError(file, errorCode, message) {
	try {
		if (errorCode === SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED) {
			alert("最多只能上传"+this.customSettings.fileUploadLimit+"个文件");
			return;
		}

		switch (errorCode) {
			case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
				alert('文件太大\n'+file.name);
				break;
			case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
				alert('不能上传0 Byte文件\n'+file.name);
				break;
			case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
				alert('文件类型错误\n'+file.name);
				break;
			default:
				if (file !== null) {
					alert('上传文件出错\n'+file.name);
				}
				break;
		}
	} catch (ex) {
        //this.debug(ex);
    }
}
function pp_fileDialogComplete(numFilesSelected, numFilesQueued) {
	try {
		this.startUpload(); //auto start
	} catch (ex)  {
        //this.debug(ex);
        alert(ex);
	}
}
function pp_uploadStart(file) {
	try {
	}
	catch (ex) {

	}
	(typeof(this.customSettings.uploadStartCallback) == 'function') && this.customSettings.uploadStartCallback();
	return true;
}
function pp_uploadProgress(file, bytesLoaded, bytesTotal) {
	try {
		var p = bytesLoaded / bytesTotal;
		var width = p * 75;
		if(width >= 75){
			width = 74;
		}
		var percent = Math.ceil(p * 1000) / 10;
		if(percent >= 100){
			percent = 99.9;
		}
		var file_dom_id = file.id + '_' + this.customSettings.loadIndex;
		$('#'+file_dom_id).find('.process_in').css({'width':width+'px'});
		$('#'+file_dom_id+'_del').find('.percent').html(percent + '%');
	} catch (ex) {
		//this.debug(ex);
	}
}
function pp_uploadSuccess(file, serverData) {
	try {
		//alert(serverData);
		var self = this;
		var file_id = file.id;
		var file_dom_id = file.id + '_' + this.customSettings.loadIndex;
		pp_deleteUpload(file_id, file_dom_id, self);
		var returnJson = eval('(pp_upload_return_'+serverData+')');
		//alert(returnJson.url);
		//$('#'+file_dom_id).find('.uploadTip').html( this.customSettings.uploadTip_success );
		(typeof(this.customSettings.uploadSuccessCallback) == 'function') && this.customSettings.uploadSuccessCallback(returnJson, file);
	} catch (ex) {
		//this.debug(ex);
	}
}
function pp_upload_return_callback(json) {
	return json;
}
/*function pp_upload_callback(file_dom_id, json) {
	if(json.rtn == 0){
		$('#'+file_dom_id).find('input').val(json.data.name);
	}else{
		$('#'+file_dom_id).find('.uploadTip').html( this.customSettings.uploadTip_error );
	}
}*/
function pp_uploadError(file, errorCode, message) {
	try {
		//var file_dom_id = file.id + '_' + this.customSettings.loadIndex;
		//$('#'+file_dom_id).find('.uploadTip').html( this.customSettings.uploadTip_error );
		var self = this;
		var file_id = file.id;
		var file_dom_id = file.id + '_' + this.customSettings.loadIndex;
		pp_deleteUpload(file_id, file_dom_id, self);

		(typeof(this.customSettings.uploadErrorCallback) == 'function') && this.customSettings.uploadErrorCallback();
		switch (errorCode) {
		case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:
			//progress.setStatus("Upload Error: " + message);
			//this.debug("Error Code: HTTP Error, File name: " + file.name + ", Message: " + message);
			break;
		case SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED:
			//progress.setStatus("Upload Failed.");
			//this.debug("Error Code: Upload Failed, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
			break;
		case SWFUpload.UPLOAD_ERROR.IO_ERROR:
			//progress.setStatus("Server (IO) Error");
			//this.debug("Error Code: IO Error, File name: " + file.name + ", Message: " + message);
			break;
		case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:
			//progress.setStatus("Security Error");
			//this.debug("Error Code: Security Error, File name: " + file.name + ", Message: " + message);
			break;
		case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
			//progress.setStatus("Upload limit exceeded.");
			//this.debug("Error Code: Upload Limit Exceeded, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
			break;
		case SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED:
			//progress.setStatus("Failed Validation.  Upload skipped.");
			//this.debug("Error Code: File Validation Failed, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
			break;
		case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
			// If there aren't any files left (they were all cancelled) disable the cancel button
			//if (this.getStats().files_queued === 0) {
				//document.getElementById(this.customSettings.cancelButtonId).disabled = true;
			//}
			//progress.setStatus("Cancelled");
			//progress.setCancelled();
			break;
		case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
			//progress.setStatus("Stopped");
			break;
		default:
			//progress.setStatus("Unhandled Error: " + errorCode);
			//this.debug("Error Code: " + errorCode + ", File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
			break;
		}
	} catch (ex) {
        //this.debug(ex);
    }
}
function pp_uploadComplete(file) {
	//if (this.getStats().files_queued === 0) {
		//alert('上传完成');
	//}
}
// This event comes from the Queue Plugin
function pp_queueComplete(numFilesUploaded) {
	//var status = document.getElementById("divStatus");
	//status.innerHTML = numFilesUploaded + " file" + (numFilesUploaded === 1 ? "" : "s") + " uploaded.";
}
/**************swfUpload Handlers*End****************/