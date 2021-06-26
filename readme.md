Steps to run code

1) npm install
2) node app.js

Apis: 

1) To Get Users Data - GET Method - http://localhost:3000/getUsers
   Query params : 
   1) page = {Number} eg: 1
   2) limit = {Number} eg: 10
   3) coordinates = {Array} eg: [12.22,34.12] 
   
2) To Create User - POST Method - http://localhost:3000/createUser
   Body - 
   {
        "data": {
            "name": "vijju",
            "mobile": "7709333123",
            "email": "abc1@gmail.com",
            "address": {
                "street": "s1",
                "city": "c1",
                "pincode": "411001",
                "locality": "Pune station",
                "state": "Maharashtra",
                "location": {
                    "type": "Point",
                    "coordinates": [73.87243803279304,18.52806125]
                }
            }
        }
    }

3) To Update User - PUT Method - http://localhost:3000/updateUser
   Body - 
   {
        "email": "vignesh1@gmail.com", //user email who is to be updated
        //Fields to be added/updated
        "data":   {
            "address" : {
                "street": "g2",
                "location": {
                    "type": "Point",
                    "coordinates": [74.0855134,15.3004543]
                }
            }
        }
    }

4) To Delete User - DELETE Method - http://localhost:3000/deleteUser
    Body - 
    {
        "email": "abc1@gmail.com"
    }
