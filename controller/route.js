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


var droppoint = {
    "target_headquarter": "1,8,1,2,1",
    "pointA": "0,1,2,1,2",
    "pointB": "8,0,1,3,1",
    "pointC": "7,9,0,1,1",
    "pointD": "2,2,2,0,1",
    "pointE": "2,9,6,7,0"
};
var users = [

    {
        "team_member_id": "1",
        "gender": "M",
        "drop_point": "pointC",
        "_id": "1"
    },
    {
        "team_member_id": "2",
        "gender": "M",
        "drop_point": "pointC",
        "_id": "2"
    }, {
        "team_member_id": "3",
        "gender": "M",
        "drop_point": "pointC",
        "_id": "3"
    },
    {
        "team_member_id": "4",
        "gender": "M",
        "drop_point": "pointA",
        "_id": "4"
    },
    {
        "team_member_id": "5",
        "gender": "M",
        "drop_point": "pointA",
        "_id": "5"
    }, {
        "team_member_id": "6",
        "gender": "M",
        "drop_point": "pointA",
        "_id": "6"
    },
    {
        "team_member_id": "7",
        "gender": "M",
        "drop_point": "pointM",
        "_id": "7"
    }

]
var cab = [{
    "id": "cab1",
    "cost": 2,
    "capacity": 2
},
{
    "id": "cab2",
    "cost": 1,
    "capacity": 3
},
{
    "id": "cab3",
    "cost": 1,
    "capacity": 3
}]


function groupBy(users) {
    sameDrop = _.groupBy(users, 'drop_point');
    var allUser = [];
    _.forOwn(sameDrop, function (value, key) {
        allUser.push(value);
    })

    return (_.flatten(allUser));
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
        var allUser = groupBy(users);
        var i = 0;
        db.findAll("User").then(function (users) {
            var length = allUser.length;
            if (length << 1) {
                var teammemberid = [];
                var path = ["target_headquarter"];
                _.each(allUser, function (obj) {
                    teammemberid.push(obj.team_member_id)
                    path.push(obj.drop_point);
                    var isLastItem = obj.team_member_id == allUser[length - 1].team_member_id
                    if (cab[i].capacity == undefined) {
                        return reject(error.sendError("badRequest", res, "not enough cabs to allocate users"));
                    }
                    if (teammemberid.length == cab[i].capacity || (teammemberid.length < cab[i].capacity && isLastItem)) {
                        routeObj = {
                            "cab_id": cab[i].id,
                            "team_member_ids": teammemberid,
                            "route": _.uniq(path),
                        }
                        obj["cabStatus"] = "booked";

                        route.push(routeObj);
                        teammemberid = [];
                        i++;
                    }

                    obj["cabStatus"] = "booked";
                })
            }
            return (sameDrop);
        }).then(function (res) {
            console.log(route)
        })


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