
//  "name" :"Rajnish",
//  "phone" :"1234567898",
//  "username":"rajnish",
//  "password":"45453455T",
//  "email": "rajnish@gmail.com"

// "name":"ddinesh",
// "username":"dinesh",
// "phone":"8888557766",
// "email":"dinesh@gmail.com",
// "password":"45453455T"
// }
const userSchema = require('../Schemas/User')
const bcrypt = require('bcrypt');


class User {
    username;
    email;
    phone;
    name;
    password;


    constructor({ username, email, phone, name, password }) {
        this.email = email,
            this.username = username,
            this.name = name,
            this.phone = phone,
            this.password = password
    }


    //static function to check if user already exist
    static verifyUsernameAndEmailExists({ username, email }) {

        return new Promise(async (resolve, reject) => {

            try {
                const user = await userSchema.findOne({ $or: [{ username }, { email }] });
                if (user && user.email === email) {
                    return reject("Email already exists")
                }
                if (user && user.username === username) {
                    return reject("User name already exist")
                }
                console.log("IN verificaton before resolve");
                return resolve();

            }
            catch (err) {
                console.log("IN verificaton after resolve");
                return reject(err)
            }
        })
    }

    registerUser() {
        return new Promise(async (resolve, reject) => {
            const hashPassword = await bcrypt.hash(this.password, 15);

            const user = new userSchema({
                username: this.username,
                name: this.name,
                password: hashPassword,
                email: this.email,
                phone: this.phone
            })

            try {
                const dbUser = await user.save();
                return resolve({
                    name: dbUser.name,
                    username: dbUser.username,
                    email : dbUser.email,
                    _id : dbUser._id
                });
            } catch (error) {
                return reject(error)
            }
        })
    }

    // username : 21maneeshpal85@gmail.com
    //email-  maneeshpal85@gmail.com
    // so here we are not allowing username same as email
    static loginUser({ loginId, password }) {
        return new Promise(async (resolve, reject) => {

            // if(validator.isEmail(loginId))
            // {
            //     dbUser= await userSchema.findOne({email:loginId});
            // }
            // else
            // {
            //     dbUser= await userSchema.findOne({username:loginId})
            // }
            let dbUser = await userSchema.findOne({ $or: [{ email: loginId }, { username: loginId }] })

            if (!dbUser) {
                return reject("No user found")
            }
            const match = await bcrypt.compare(password, dbUser.password);
            if (!match) {
                return reject("Invalid password");
            }
            resolve({
                name: dbUser.name,
                username: dbUser.username,
                email : dbUser.email,
                _id : dbUser._id
            })
        })
    }
}

module.exports = User