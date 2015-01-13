//Step 1. 取消下面的注释开启simple插件，注意需要先进行插件安装 npm install -g fis-postpackager-simple
 fis.config.set('modules.postpackager', 'simple');

//通过pack设置干预自动合并结果，将公用资源合并成一个文件，更加利于页面间的共用

//Step 2. 取消下面的注释开启pack人工干预
fis.config.merge({
	'pack': {
		'js/lib.js': [
			'/js/ex/jquery-1.8.2.min.js',
			'/js/ex/template.js',
			'/js/ex/swfupload.js',
			'/js/ex/swfupload.queue.js',
			'/js/ex/md5.js',
			'/js/global.js',
			'/js/lib/browser.js',
			'/js/lib/cookie.js',
			'/js/lib/getJSONEx.js',
			'/js/lib/postEx.js',
			'/js/lib/htmlTranscode.js',
			'/js/lib/observer.js',
			'/js/lib/others.js',
			'/js/pp/page.js',
			'/js/pp/selector.js',
			'/js/pp/upload.js',
			'/js/pp/checkData.js',
			'/js/pp/alertWindow.js'
	    ]
	}
});

//Step 3. 取消下面的注释可以开启simple对零散资源的自动合并
//fis.config.set('settings.postpackager.simple.autoCombine', true);


//Step 4. 取消下面的注释开启图片合并功能
// fis.config.set('roadmap.path', [{
//     reg: '**.css',
//     useSprite: true
// }]);
// fis.config.set('settings.spriter.csssprites.margin', 20);