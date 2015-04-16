var express = require('express')
var url = require('url')
var cheerio = require('cheerio')
var fs = require('fs')
var icv = require('iconv-lite')
var request = require('request')

/*define news url*/

var srcUrl = 'http://news.163.com/'

request.get(srcUrl,function  (err,res,body) {
	if(err){
		console.log(err);
		return ;
	}

	/*calll cheerio to load html content*/
	var $ = cheerio.load(body);
	var urls = [];
	$('a','.ns-wnews').each(function(index,ele){
		var urlItems = $(ele);
		urls.push({
			/*push urls into array urls*/
			href : urlItems.attr('href')
		});
	});
	
	var file = 'urls.txt';
	var urlstr = JSON.stringify(urls);
	fs.writeFile(file,urlstr,function(err){
		if(err){
			console.log(err);
			return ;
		}
	})

})
