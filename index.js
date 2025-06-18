const http = require ('http')
const fs = require('fs')
const url = require('url')

http.createServer((req,res)=>{

    let URL=url.parse(req.url,true);
    let products = JSON.parse(fs.readFileSync('./products.json','utf-8'))
    let Query = URL.query;
    
    if(URL.pathname==='/products' && req.method=='GET' && Query.id==undefined){
       res.end(JSON.stringify(products))
    }else if (URL.pathname==='/products' && req.method=='GET' && Query.id!=undefined){
        let product = products.find((product)=>{
            return product.id == URL.query.id;
        })
        if (product!==undefined){
            res.end(JSON.stringify (product))
        }else{
            res.end(JSON.stringify({"message":"Product ID is invalid"}))
        }
     }else if (req.method=="POST" && URL.pathname==="/products"){
        let product = "";
        req.on('data',(chunk)=>{
            product = product+chunk;
        })
        req.on('end',()=>{
            let newProduct=JSON.parse(product);
            products.push(newProduct);
            fs.writeFile('./products.json',JSON.stringify(products),(err)=>{
                if(err!=null){
                    res.end(JSON.stringify({error:err.message}));
                }else{
                    res.end(JSON.stringify({"message":"Product added successfully"}));
                }
            });
        })
     }else if(req.method=='DELETE' && URL.pathname==='/products'){
        //find eken gnne object ek ... slice ekt ona index eka
        let productIndex = products.findIndex((product)=>{
            return product.id==Query.id;
        })
        
        if(productIndex!=-1){
            products.splice(productIndex,1); //product index eken patan aran ekak delete karanawa
            fs.writeFile('./products',JSON.stringify(products),(err)=>{
                if(err!==null){
                    res.end(err.message);
                }else{
                    res.end(JSON.stringify({"message":"Product deleted successfully"}));
                }
            })
        }else{
            res.end(JSON.stringify({"message":"Product ID is invalid"}));
        }
        
     }else if(req.method=='PUT',URL.pathname==='/products'){
        let index=products.findIndex((product)=>{
            return product.id==Query.id;
        })
        if(index!=-1){
            let product = "";
            req.on('data',(chunck)=>{
                product+= chunck;


            })
            req.on('end',()=>{
                let newProduct=JSON.parse(product);
                products[index]=newProduct;
                fs.writeFile('./products.json',JSON.stringify(products),(err)=>{
                    if(err!=null){
                        res.end(err.message);
                    }else{
                        res.end(JSON.stringify({"message":"Product updated successfully"}));
                    }
                })
            })
        }



     }
    

     
    
}).listen(7000)

