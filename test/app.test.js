const app =require('../app');
const chai= require('chai');
const chaiHttp=require('chai-http');
app.set('port', 3000);
const {expect}=chai;
chai.use(chaiHttp)

describe("open api server",()=>{
    it("open api ",done => {
        chai.request(app).get("/api-docs")
            .end((err,res)=>{
                expect(res).to.have.status(200)
                done()
            })

    })
})


describe("server 404",()=>{
    it("404 handheld in api ",done => {
        chai.request(app).get("/random")
            .end((err,res)=>{
                expect(res).to.have.status(404)
                done()
            })

    })
})

describe("apartment api protection",()=>{
    it("apartment api response on Unauthorized access",done => {
        chai.request(app).post("/apartments/createaparment")
            .end((err,res)=>{
                expect(res).to.have.status(401)
                expect(res.forbidden)
                expect(res.text).to.equal("Unauthorized")
                done()
            })

    })
})

describe("users favorite  api protection",()=>{
    it("users favorite api response on Unauthorized access",done => {
        chai.request(app).post("/users/favorite/add")
            .end((err,res)=>{
                expect(res).to.have.status(401)
                expect(res.forbidden)
                expect(res.text).to.equal("Unauthorized")
                done()
            })

    })
})