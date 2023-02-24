const file = require('fs');
const http = require('http');
const url = require('url');

const replaceTemplate = require('./modules/replace-template')

// Blocking Syncronous code
// const textIn = file.readFileSync('./txt/input.txt', 'utf-8');

// console.log("File Content", textIn);

// const textOut = `This is the text to write into this file. ${textIn}\n created at ${Date.now()}`

// file.writeFileSync('./txt/output.txt', textOut);

// console.log("File written");

// non-blocking asyncronous code
// file.readFile('./txt/start.txt', 'utf-8', (error, data1)=> {
//     file.readFile(`./txt/${data1}.txt`, 'utf-8', (error, data2) => {
//         console.log(data2);
//     })
// })


const data = file.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const dataObj = JSON.parse(data);

const tempOverview = file.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8')
const tempProduct = file.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8')
const tempCard = file.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8')

// Creating a server
const server = http.createServer((req, res) => {

    const { query, pathname } = url.parse(req.url, true);

    // Overview
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {
            'Content-Type': 'text/html',
        })

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('')

        const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);

        res.end(output);

        // Products
    } else if (pathname === '/product') {
        res.writeHead(200, {
            'Content-Type': 'text/html',
        })
        const product = dataObj[query.id];

        const output = replaceTemplate(tempProduct, product)
        res.end(output);

        // API
    } else if (pathname === '/api') {
        res.writeHead(200, { 'Content-type': 'application/json' })
        res.end(data);

        // 404 Not Found
    } else {
        res.writeHead(404, {
            'Content-Type': 'text/html',
        })
        res.end('<h1>PAGE NOT FOUND!</h1>');
    }
})

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to port 8000');
})