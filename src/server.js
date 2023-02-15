const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const parseBody = (request, response,) => {
  return new Promise((resolve, reject) => {
    let chunks = [];

    request.on('error', (err) => {
      console.log('Error', err);
      reject(new Error('Error parsing body'))
    }) 
  
    request.on('data', (chunk) => {
      chunks.push(chunk);
    });
  
    request.on('end', () => {
      const body = Buffer.concat(chunks).toString();
      const bodyParams = query.parse(body);

      resolve(bodyParams);
    });
  })

}

const handlePost = async (request, response, parsedUrl) => {
  console.log('POST', parsedUrl);
  if (parsedUrl.pathname === '/addUser') {
    try {
      const bodyParams = await parseBody(request, response);
      jsonHandler.addUser(request, response, bodyParams);
    } catch (e) {
      response.statusCode = '400';
      response.end();
    }
  } else {
    response.statusCode = '501';
    response.end();
  }

};

const handleGet = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/style.css') {
    htmlHandler.getCSS(request, response);
  } else if (parsedUrl.pathname === '/getUsers') {
    jsonHandler.getUsers(request, response);
  } else {
    htmlHandler.getIndex(request, response);
  }
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  if (request.method === 'GET') {
    handleGet(request, response, parsedUrl);
  } else if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else {
    response.end();
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
