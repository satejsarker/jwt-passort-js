const userSchema = {
    type: "object",
    properties: {
        email: { type: "string" },
        password: { type: "string" },
        favorites: {
            type: "array"
        }
    },
    required: ["email", "password"],
    additionalProperties: false
}
module.exports = userSchema