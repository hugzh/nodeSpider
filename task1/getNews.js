var cheerio = require('cheerio')
var request = require('request')
var fs = require('fs')
var iconv = require('iconv-lite')
var http = require('http')


/*get one url from file urls.txt*/
fs.readFile('urls.txt','utf-8',function (err,data) {
	if(err){
		console.log(err);
		return ;
	}

	var urlArray = data.split('\"},');
	var urlstr = urlArray[0].split(':\"');
	
	var url = urlstr[1];
	console.log(url);
	http.get(url,function (res) {
		//this step is very important
		//it change gbk unicode into binary,avoid error

		res.setEncoding('binary');
		var article = '';
		res.on('data',function (data) {
			article += data;
		}).on('end', function () {
			var buf = new Buffer(article, 'binary');

			//decode the content in gbk unicode
			//depend on plus-in iconv
			var gbkStr = iconv.decode(buf, 'GBK');

			var $ = cheerio.load(gbkStr);
			var result = [];
			var title = $('#h1title').text();
			var cont  = '';
			$('p','#endText').each(function(index,ele){
				cont+=$(this).text();
			});

			result.push({ArticleTitle:title,ArticleContent:cont});
			var file = 'article.txt';
			fs.writeFile(file,JSON.stringify(result),function(err){
				if(err){
					console.log("write file failed"+err);
					return ;
				}
			});
			
		})
		}).on('error', function (err) {
			console.log(err);
		});
});