var express = require('express'),
    Promise = require('bluebird'),
    _ = require('lodash'),
    error = require('../services/error'),
    db = require('../services/db'),
    bodyParser = require('body-parser'),
    id = require('shortid'),
    router = express.Router();



var routes = [];
router.get('/route_plan', function (req, res) {
    return new Promise(function (resolve, reject) {
        var users;
        db.findAll("User").then(function (users) {
            console.log(users)
            //------for loopppp------
            return resolve(users);
        }).then(function () {

        }).then(function () {
            return resolve(res.send(users));
        })
    });
})
var users = [

    {
        "team_member_id": "4",
        "gender": "M",
        "drop_point": "pointC",
        "_id": "4"
    },
    {
        "team_member_id": "1",
        "gender": "M",
        "drop_point": "pointC",
        "_id": "4"
    }, {
        "team_member_id": "3",
        "gender": "M",
        "drop_point": "pointC",
        "_id": "4"
    },
    {
        "team_member_id": "2",
        "gender": "M",
        "drop_point": "pointA",
        "_id": "4"
    }
]
var cab = [{
    "id": "cab3",
    "cost": 2,
    "capacity": 2
},
{
    "id": "cab4",
    "cost": 1,
    "capacity": 4
}]


function groupBy(users, cab) {
    sameDrop = _.groupBy(users, 'drop_point');
    return (sameDrop);
}
/*
function allocate() {
    return new Promise(function (resolve, reject) {

        var route = [];
        var routeObj = {};
        var sameDrop = groupBy(users, cab)
        if (sameDrop.pointC.length << 1) {

            var teammemberid = [];
            var path = ["target_headquarter"];

            _.each(sameDrop.pointC, function (obj) {
                console.log(obj, "++")
                console.log(obj["team_member_id"], "--")
                teammemberid.push(obj["team_member_id"])
                path.push(obj["drop_point"]);

            })
            

            routeObj = {
                "cab_id": cab[0].id,
                "team_member_ids": teammemberid,
                "route": _.uniq(path),
                // "route_cost": 
            }
        }
        console.log(routeObj, "xx")
    })
}
*/

allocate();
function allocate() {
    return new Promise(function (resolve, reject) {

        var route = [];
        var routeObj = {};
        var i = 0;
        var bool = true;
        var sameDrop = groupBy(users, cab)
        if (sameDrop.pointC.length << 1) {
            var teammemberid = [];
            var path = ["target_headquarter"];
            _.each(sameDrop.pointC, function (obj) {
                obj["cabStatus"] = "booked";
                teammemberid.push(obj["team_member_id"])
                path.push(obj["drop_point"]);
                console.log(teammemberid.length, cab[i].capacity)
                if (teammemberid.length == cab[i].capacity) {
                
                    i++;
                    bool = true;
                }

            })

            console.log(i, "imiiiiiii", bool)

            routeObj[i] = {
                "cab_id": cab[i].id,
                "team_member_ids": teammemberid,
                "route": _.uniq(path),
                // "route_cost": 
            }
            console.log(routeObj[0], routeObj[1])

      
        }
        console.log(route, "+++++")

        console.log(routeObj, "xx")
    })
}


module.exports = router;
/*{
    "total_cost": "5",
    "routes": [
      {
        "cab_id": "cab1",
        "team_member_ids": "4,5",
        "route": "target_headquarter,pointE",
        "route_cost": 2
      },
      {
        "cab_id": "cab2",
        "team_member_ids": "3,2,1",
        "route": "target_headquarter,pointA,pointB,pointC",
        "route_cost": 3
      }
    ]
   }
   */