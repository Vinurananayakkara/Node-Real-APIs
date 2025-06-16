const http = require ('http')
const fs = require('fs')
const url = require('url')

http.createServer((req,res)=>{

    let URL=url.parse(req.url,true);
    let products = JSON.parse(fs.readFileSync('./products.json','utf-8'))
    
    if(URL.pathname==='/products' && req.method=='GET' && URL.query.id==undefined){
       
       res.end(products)
    }else if (URL.pathname==='/products' && req.method=='GET' && URL.query.id!=undefined){
        let product = products.find((product)=>{
            return product.id == URL.query.id;
        })
        if (product!=undefined){
            console.log(product)
            res.end(JSON.stringify (product))
        }else{
            res.end(JSON.stringify({"message":"Product ID is invalid"}))
        }
    }
    
}).listen(7000)

