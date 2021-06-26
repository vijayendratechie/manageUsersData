const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const Users = require("./app/models/users")

var app = express();
app.use(bodyparser());

const port=process.env.PORT || 3000
app.listen(port,function()
{
	console.log(`listen to port ${port}`);
});

//Db connection
mongoose.connect("mongodb+srv://vijju:vijju@cluster0-ex1xq.mongodb.net/manageUsersData?retryWrites=true&w=majority&ssl=true", 
				{ useNewUrlParser: true, useUnifiedTopology: true})
                .catch(err => {
                    console.log("===mongo connection error: ",err)
                });

//Create a new User                
app.post("/createUser",function(req,res) {
    userData = new Users(req.body.data)
    userData.save(userData)
    .then(user => {
        res.status(200).send({status: "success", message: "user created successfully"})
    })
    .catch(err => {
        console.log("===Error occured while creating user: ",err)
        res.status(400).send({status: "error", message: "Error occured while creating user"})
    })
})

//Get Users
app.get("/getUsers", function(req,res) {
    let coordinates = req.query.coordinates ? JSON.parse(req.query.coordinates) : false; 
    let page = parseInt(req.query.page) || 0 ;
    let limit = parseInt(req.query.limit) || 2;

    if(!coordinates) {
        //Get users in sorted order of createdAt with pagination and limit
        Users.find({})
        .sort({createdAt: -1})  //indexed createdAt property in descending order
        .limit(limit)
        .skip(limit * page)
        .exec()
        .then(users => {
            res.status(200).send({status: "success", users})
        }).catch(err => {
            console.log("===Error occured while fetching users in sorted order of createdAt: ",err)
            res.status(400).send({status: "error", message: "Error occured while fetching users in sorted order of createdAt"})
        })            
    } else {
        if(Array.isArray(coordinates)) {
            //Get users sorted by their distance from given point
            Users.find({"address.location": {$near: {$geometry: {type: "Point", coordinates}}}})
            .then(users => {
                res.status(200).send({status: "success", users})
            }).catch(err => {
                console.log("===Error occured while fetching user: ",err)
                res.status(400).send({status: "error", message: "Error occured while fetching user"})
            })
        } else {
            res.status(400).send({status: "error", message: "Invalid coordinates"})
        }
    }
});

app.put("/updateUser", function(req,res) {
    if(!req.body.email || !req.body.data) {
        res.status(400).send({status: "error", message: "Please provide all required information"})
    } else {
        let email = req.body.email // Unique Field
        let updatedUser = req.body.data
        updatedUser.updatedAt = Date.now() //Update the updatedAt property

        //If address object present, update only mentioned keys without replacing entire object
        if(req.body.data.address) {
            let addressKeys = Object.keys(req.body.data.address)
            addressKeys.map(key => {
                updatedUser["address."+key] = req['body']['data']['address'][key]
            })
            delete updatedUser.address
        }
        Users.update({email},
            {
                $set: req.body.data
            })
        .then(user => {
            if(user.n === 0 ) {
                res.status(200).send({status: "success", message: "user does not exists"})
            } else {
                console.log("===user: "+JSON.stringify(user,null,4))
                res.status(200).send({status: "success", message: "user updated successfully"})
            }
        })
        .catch(err => {
            console.log("===Error occured while updating user: ",err)
            res.status(400).send({status: "error", message: "Error occured while updating user"})
        })
    }
})

app.delete("/deleteUser", function(req,res) {
    if(!req.body.email) {
        res.status(400).send({status: "error", message: "Please provide user email"})
    } else {
        let email = req.body.email // Unique Field

        Users.remove({email})
        .then(user => {
            if(user.n === 0 ) {
                res.status(200).send({status: "success", message: "user does not exists"})
            } else {
                res.status(200).send({status: "success", message: "user deleted successfully"})
            }  
        })
        .catch(err => {
            console.log("===Error occured while deleting user: ",err)
            res.status(400).send({status: "error", message: "Error occured while deleting user"})
        })
    }
})