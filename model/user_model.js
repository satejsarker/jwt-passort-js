const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema
    // console.log(Schema)
const userModel = new Schema({
    email: String,
    password: {
        type: String,
    },
    favorites: {
        type: Array,
        default: []
    }
})

userModel.pre(
    'save',
    async function(next) {
        const user = this;
        const hash = await bcrypt.hash(this.password, 10);

        this.password = hash;
        next();
    }
);
userModel.methods.isValidPassword = async function(password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);

    return compare;
}

module.exports = User = mongoose.model('users', userModel)