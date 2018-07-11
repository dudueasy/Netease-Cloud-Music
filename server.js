let qiniu = require('qiniu')
let http = require('http')
let fs = require('fs')
let url = require('url')
let port = process.argv[2]

// 指定端口
port = 8888

if (!port) {
  console.log('请指定端口号, eg: \nnode Nodejs_Server_And_Promise_Ajax.js 8888')
  process.exit(1)
}

let server = http.createServer(function (request, response) {
  let parsedUrl = url.parse(request.url, true)
  let pathWithQuery = request.url


  let path = parsedUrl.pathname
  let query = parsedUrl.query
  let method = request.method

  console.log('查询字符串的路径为 \n' + pathWithQuery)
  console.log(method)

  // 访问根路径
  if (path === '/') {
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.setHeader('Access-Control-Allow-Origin', '*')

    responseData = 'welcome'
    response.write(responseData)
  }
  
  // Getting secretKey from local file and send it to administor browser
  else if (path === '/uptoken') {
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.setHeader('Access-Control-Allow-Origin', '*')

    // getSongData access to QiniuCloud
    var config = getDBData('qiniu-key.json')
    config = JSON.parse(config)

    let {accessKey, secretKey} = config
    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);


    // create uploadToken
    var options = {
      scope: '163-music',
    };

    var putPolicy = new qiniu.rs.PutPolicy(options);
    var uploadToken = putPolicy.uploadToken(mac);


    // define response data
    responseData = {
      uptoken:  uploadToken 
    }

    response.end(JSON.stringify( responseData ))
  }
  else {
    console.log(path)
    response.statusCode = 404
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write('404 not found')
    response.end()
  }
}
)

//================ 工具代码start here ================

function getDBData(path, option = 'utf8') {
  db_data = fs.readFileSync(path, option)
  return  db_data
}

function updateDBData(path, data) {
  fs.writeFileSync(path, data)

}

function putDBDataToHtml(htmlData, DBData) {
  return htmlData.replace('$tobereplaced$', DBData)

}

//================ 工具代码end here ================


server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)

