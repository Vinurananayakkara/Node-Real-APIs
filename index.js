const http = require ('http')
const fs = require('fs')
const url = require('url')

http.createServer((req,res)=>{

    let URL=url.parse(req.url,true);
    let products = JSON.parse(fs.readFileSync('./products.json','utf-8'))
    let Query = URL.query;
    
    if(URL.pathname==='/products' && req.method=='GET' && Query.id==undefined){
       res.end(products)
    }else if (URL.pathname==='/products' && req.method=='GET' && Query.id!=undefined){
        let product = products.find((product)=>{
            return product.id == URL.query.id;
        })
        if (product!==undefined){
            res.end(JSON.stringify (product))
        }else{
            res.end(JSON.stringify({"message":"Product ID is invalid"}))
        }
     }else if (req.method=="POSt" && URL.pathname==="/products"){
        let product = "";
        req.on('data',(chunk)=>{
            product = product+chunk;
        })
        req.on('end',()=>{
            let newProduct=JSON.parse(product);
            products.push(newProduct);
            fs.writeFile('./products.json',JSON.stringify(products),(err)=>{
                if(err!==null){
                    res.end(err);
                }else{
                    res.end(JSON.stringify({"message":"Product added successfully"}));
                }
            });
        })
     }
    

     
    
}).listen(7000)

