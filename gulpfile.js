//导入工具包 require('node_modules里对应模块')
var gulp = require('gulp'), //基础库
	fs = require('fs'), //文件夹
	less = require('gulp-less'), //LESS编译
	cleanCss = require('gulp-clean-css'), //css压缩
	ugfily = require('gulp-uglify'), //js压缩
	rename = require('gulp-rename'), //文件重命名
	htmlmin = require('gulp-htmlmin'),  //html压缩
	browserSync = require('browser-sync').create(), //自动刷新
	rev = require('gulp-rev-append'), //添加版本号，清除页面引用缓存
	fileinclude = require('gulp-file-include'); //include包含模板文件

	//定义一个minify-css任务
	gulp.task('minify-css',function(){
		gulp.src('src/less/*.less')
			.pipe(less()) //该任务调用的模块
			.pipe(cleanCss({compatibility:'ie8'}))
			.pipe(gulp.dest('dist/css')) //输出路径
			.pipe(gulp.dest('src/css')) //输出到src开发目录下，使得css可以添加版本号
			.pipe(browserSync.stream()); //自动刷新
	});

	//定义一个minify-js任务
	gulp.task('minify-js',function(){
		gulp.src('src/js/*.js') //指明源文件路径、并进行文件匹配
			.pipe(ugfily({preserveComments:'some'})) //使用uglify进行压缩，并保留部分注释
			.pipe(gulp.dest('dist/js')) //输出路径
			.pipe(browserSync.stream()); //自动刷新
	});

	//定义一个copy-js任务
	gulp.task('copy-js',function(){
		gulp.src('src/js/*/*.js') //指明源文件路径、并进行文件匹配
			.pipe(gulp.dest('dist/js')); //输出路径
	});

	//定义一个minify-html任务
	gulp.task('minify-html',function(){
		var options = {
			removeComments: true,//清除HTML注释
		    collapseWhitespace: true,//压缩HTML
		    collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
		    removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
		    removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
		    removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
		    minifyJS: true,//压缩页面JS
		    minifyCSS: true//压缩页面CSS
		};
		gulp.src(['src/*.html'])
			.pipe(fileinclude({ //include包含模板文件
				prefix : '@@',
				basepath : '@file'
			}))
			.pipe(rev()) //添加版本号
			.pipe(htmlmin(options)) //压缩HTML
			.pipe(gulp.dest('dist'))
			.pipe(browserSync.stream()); //自动刷新
	});

	//定义一个minify-img任务
	gulp.task('minify-img',function(){
		gulp.src('src/img/*.*')
			.pipe(gulp.dest('dist/img'))
	})

	//监听任务
	gulp.task('watch',function(){

		browserSync.init({ //自动刷新路径
            server: {
	            baseDir: "./dist/"
	        }
        });

		// 监听 html
		gulp.watch('src/*.html',['minify-html']);

		// 监听 scss
		gulp.watch('src/less/*.less',['minify-css']);

		// 监听 js
		gulp.watch('src/js/*.js',['minify-js']);

		// 监听 js
		gulp.watch('src/img/*.*',['minify-img']);

		// 监听 html
		gulp.watch('src/*.html').on('change',browserSync.reload);

	})

	//定义默认任务 
	gulp.task('default',['minify-css','minify-js','copy-js','minify-html','minify-img','watch']);