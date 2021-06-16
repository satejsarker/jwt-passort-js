# API for XYZ apartment service 
#### API documentation  is available on `openapi.json` file 

install  instruction
>unzip this file and from the root of this project directory, 
install dependency by

`   
        npm i
`

>to start this project : `npm start`

### Open api spec will be available on
>http://localhost:8000/api-docs 

>DB is pointed to a dummy free cluster  
> you can use it or you can add your DB_URL in  
` .env file 
 `
or you can use this .env  

 .env file 
`
DB_URL=mongodb+srv://{username}:{password}@cluster0.qszem.mongodb.net/HOMELINK_API?
> retryWrites=true&w=majority
PORT=8000
TOKEN_SECRET=TOP_SECRET
`