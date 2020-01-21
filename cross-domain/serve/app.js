

const http = require('http')
const { URL } = require('url')
const querystring = require('querystring');
const serve = http.createServer()
const resloveData = req => {
  let data = "";
  const { method, url } = req
  const { pathname, search } = new URL(url, 'http://localhost:300')
  return new Promise(reslove => {
    switch (method) {
      case "GET":
        data = querystring.parse(search.slice(1))
        reslove({ pathname: pathname, method: method, data: data })
        break;

      case "POST":
        req.on('data', chunk => {
          data += chunk
        })
        req.on('end', () => {
          data = decodeURIComponent(data)
          try {
            data = JSON.parse(data)
          } catch (error) {
            data = querystring.parse(data)
          }
          reslove({ pathname: pathname, method: method, data: data })
        })
        break;

      default:
        reslove({ pathname: pathname, method: method, data: data })
    }
  })
}

serve.on('request', async (req, res) => {
  /* 统一设置全部 */
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  // res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  // res.setHeader('Access-Control-Allow-Credentials', true) //  设置携带cookie
  // if (res.method === 'OPTIONS') {
  //   res.status = 200
  //   res.end()
  // }

  res.setHeader('Access-Control-Max-Age',1)
 

  const { pathname, data, method } = await resloveData(req)
  if (pathname === '/simple-get') {
    res.setHeader('Access-Control-Allow-Origin', '*') //设置允许跨域的请求头
    res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' });
    res.end(JSON.stringify(data))
    return
  }

  if (pathname === '/simple-post') {
    res.setHeader('Access-Control-Allow-Origin', '*') //设置允许跨域的请求头
    res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' });
    res.end(JSON.stringify(data))
  }

  if (pathname == '/preflight-post') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader("Access-Control-Allow-Headers", "*");
    if (method === 'OPTIONS') {
      res.status = 200
      res.end('hello world')
      return
    }
    res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' })
    res.end(JSON.stringify(data))
  }

  if (pathname === '/simple-with-cookie') {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080') //设置允许跨域的请求头
    res.setHeader('Access-Control-Allow-Credentials', true) //  设置携带cookie
    res.end(JSON.stringify(data))
  }

  if (pathname === '/preflight-post-with-cookie') {
    res.setHeader("Access-Control-Allow-Headers", "Authorization,Content-Type");
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080') //设置允许跨域的请求头
    res.setHeader('Access-Control-Allow-Credentials', true) //  设置携带cookie
    res.end(JSON.stringify(data))
  }
})





serve.listen('3000', function () {
  console.log('🍎 serve is runing......')
})






 // res.setHeader("Access-Control-Allow-Methods", "*");
  // res.setHeader("Access-Control-Allow-Headers", "*");
  // // res.setHeader("Access-Control-Allow-Headers", "Content-Type,Access-Token")
  // res.setHeader('Access-Control-Allow-Credentials',true)
  // if(req.method=='OPTIONS'){
  //   res.status = 200
  //   res.end()
  //   return
  // }
  // const { method } = req
  // const { pathname, search } = new URL(req.url, 'http://localhost:300')
  // const data = method === 'POST' ? await resloveData(req) : '' // post 请求的data

