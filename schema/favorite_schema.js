module.exports={
    type:"object",
    properties:{
         favorites_items:{
        type: "array",
        items:{
            type: "string"
        },
        minItems: 1
    }
    }
   ,
    additionalProperties: false,
    required:["favorites_items"]
}