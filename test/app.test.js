const app =require('../app');
const chai= require('chai');
const chaiHttp=require('chai-http');
const UserModel=require("../model/user_model")
app.set('port', 3000);
const {expect}=chai;
chai.use(chaiHttp)

before( (done)=>{
    console.log("before all")
    this.email="apitest@gmail.com"
    this.password="12345"
    this.token="dummy"
    done()

})

after(  (done) => {
      UserModel.deleteOne({email:this.email}).then((err,res)=>{
          done()
      })
})

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
        chai.request(app).post("/apartments/createaparment").send({})
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
        chai.request(app).post("/users/favorite/add").send({})
            .end((err,res)=>{
                expect(res).to.have.status(401)
                expect(res.forbidden)
                expect(res.text).to.equal("Unauthorized")
                done()
            })

    })
})

describe("user sign up and token generation",()=>{
    it("user create and get token after login",done=>{
        chai.request(app).post("/users/signup").send({
            email:this.email,
            password:this.password
        }).end((err,res)=>{
            expect(res).to.have.status(201)
            expect(res.body.message).to.equal("Signup successful")
            chai.request(app).post("/users/login").send({
            email:this.email,
            password:this.password
        }).end((err,res)=>{
            expect(res.body).to.haveOwnProperty("token")
            })
            done()
        })
    })

})



describe("All apartments list ",()=>{
    it("check all the apartments", done=>{
            chai.request(app).post("/users/login").send({
            email:this.email,
            password:this.password
        }).end((err,res)=>{
            chai.request(app).get("/apartments/allapartments").end((err, res) => {
                expect(res.body).not.empty
                expect(res).to.have.status(200)
            })
            })
            done()
        })

})