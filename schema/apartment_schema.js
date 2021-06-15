module.exports = {
    type: "object",
    required: ["city", "country", "rooms", "location"],
    properties: {
        additionalItems: false,
        name: {
            type: "string"
        },
        address: {
            type: "string"
        },
        user_id: {
            type: "string"
        },
        city: {
            type: "string"
        },

        country: {
            type: "string"
        },

        rooms: {
            type: "number"
        },
        location: {
            type: "object",
            properties: {
                coordinates: {
                    type: "array",
                    minItems: 2,
                    items: [{ type: "number" }, { type: "number" }],
                    "additionalItems": false
                }

            }

        }

    }

}