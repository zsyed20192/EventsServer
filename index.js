const http = require("http");
const path = require("path");
const fs = require("fs");
const { MongoClient } = require("mongodb");
const client = new MongoClient("mongodb+srv://johndoe:Grad798unh@cluster0.dhrmxrd.mongodb.net/");

async function fetchEvents() {
    
    try {
        await client.connect();
        console.log("connected to Mongo!!")

        const database = client.db("eventlistdatabase"); 
        const collection = database.collection("eventlist"); 

        const events = await collection.find({}).toArray();

        return events;
    } finally {
        await client.close();
    }
}


const server = http.createServer(async (req, res) => { 
    
    if (req.url === '/') {
        // read public.html file from public folder
        fs.readFile(path.join(__dirname, 'index_3.html'),
                    (err, content) => {
                                    
                                    if (err) throw err;
                                    res.writeHead(200, { 'Content-Type': 'text/html' });
                                    res.end(content);
                        }
              );
     }

    else if (req.url === '/about') {


        // read the about.html file public folder
        fs.readFile(
            path.join(__dirname,'about.html'),
                    (err, content) => {
                                    
                                    if (err) throw err;
                                    res.writeHead(200, { 'Content-Type': 'text/html' });
                                    res.end(content);
                        }
              );
     }
         else if (req.url === '/style.css') {
        fs.readFile(path.join(__dirname, 'style.css'), (err, content) => {
            if (err) throw err;
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.writeHead(200, { 'Content-type': 'text/css' });
            res.end(content);
        });
    }
    else if (req.url==='/api')
    {
        try {
            const events = await fetchEvents();

             res.writeHead(200, {'Content-Type': 'application/json','Access-Control-Allow-Origin':'*'})

            res.end(JSON.stringify(events));
        } catch (error) {
            console.error(error);
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.end("Internal Server Error");
        }
    }
    else{
        res.end("<h1> 404 nothing is here</h1>");
    }

    /*

        But what if we have  1000 pages/urls ? do we need to write 1000 if-else statements?

    /*/
});

// it will first try to look for
// environment variable, if not found then go for 5959
const PORT= process.env.PORT || 2867;

// port, callback
server.listen(PORT,()=> console.log(`Great our server is running on port ${PORT} `));
