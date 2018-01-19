var express = require('express'),
    Promise = require('bluebird'),
    _ = require('lodash'),
    error = require('../services/error'),
    db = require('../services/db'),
    bodyParser = require('body-parser'),
    id = require('shortid'),
    router = express.Router();

router.get('/route_plan', function (req, res) {
    return new Promise(function (resolve, reject) {
        db.findAll("Route").then(function (allRoutes) {
            if (allRoutes.length == 0) {
                return reject(error.sendError("badRequest", res, "no routes found"));
            }
            var total_cost = _.sumBy(allRoutes, "route_cost");
            var result = {
                "total_cost": total_cost,
                "routes": allRoutes
            };

            return resolve(result);
        }).catch(function (err) {
            return reject(err)
        })
    })
})

function groupBy() {
    return new Promise(function (resolve, reject) {
        db.findAll("User").then(function (users) {
            sameDrop = _.groupBy(users, 'drop_point');
            var allUser = [];
            _.forOwn(sameDrop, function (value, key) {
                allUser.push(value);
            })
            return (allUser);
        }).then(function (allUser) {
            return resolve(_.flatten(allUser));
        }).catch(function (err) {
            return reject(err);
        })
    });
}

allocate();
function allocate() {
    return new Promise(function (resolve, reject) {
        var routes = [];
        var routeObj = {};
        var allUser = [];
        var i = 0;
        groupBy().then(function (_allUser) {
            allUser = _allUser;
            return db.findAll("Cabs");
        }).then(function (_cab) {
            var cab = _.orderBy(_cab, ['capacity'], ['desc']);
            var length = allUser.length;
            if (allUser.length == 0) {
                return reject("there are no user!");
            }
            var teammemberid = [];
            var path = ["target_headquarter"];
            _.each(allUser, function (obj) {
                teammemberid.push(obj.team_member_id)
                path.push(obj.drop_point);
                var isLastItem = obj.team_member_id == allUser[length - 1].team_member_id
                if (cab[i].capacity == undefined) {
                    return reject("not enough cabs");
                }
                if (teammemberid.length == cab[i].capacity || (teammemberid.length < cab[i].capacity && isLastItem)) {
                    var routeCost = routeDistance(path);
                    var bestRoutePath = bestRoute(path);
                    routeObj = {
                        "cab_id": cab[i].id,
                        "team_member_ids": teammemberid,
                        "route": bestRoutePath,
                        "route_cost": _.sum(routeCost) // *cab  cost
                    };

                    routes.push(routeObj);
                    teammemberid = [];
                    path = ["target_headquarter"];
                    i++;
                }
                obj["cabStatus"] = "booked";
            })
            return (sameDrop);
        }).then(function (res) {
            console.log(routes)
        }).catch(function (err) {
            return reject(err);
        })
    });
}
/*

target_headquarter: [ 1, 8, 1, 2, 1 ],
pointA: [ 0, 1, 2, 1, 2 ],
pointB: [ 8, 0, 1, 3, 1 ],
pointC: [ 7, 9, 0, 1, 1 ],
pointD: [ 2, 2, 2, 0, 1 ],
pointE: [ 2, 9, 6, 7, 0 ] } 
*/
//routeDistance(["target_headquarter", "pointB", "pointC", "pointA"]) 
function routeDistance(_path) {
    //console.log(_path,"_path")
    path = _.uniq(_path);
    var drops = [{
        _id: 'Skcdl804f',
        target_headquarter: [1, 8, 1, 2, 1],
        pointA: [0, 1, 2, 1, 2],
        pointB: [8, 0, 1, 3, 1],
        pointC: [7, 9, 0, 1, 1],
        pointD: [2, 2, 2, 0, 1],
        pointE: [2, 9, 6, 7, 0]
    }];
    var map = {
        "pointA": 0,
        "pointB": 1,
        "pointC": 2,
        "pointD": 3,
        "pointE": 4
    };
    var distance = [];
    for (i = 0; i <= path.length - 2; i++) {
        var curr = path[i];
        var checkArr = drops[0][curr];
        var to = path[i + 1]
        var kk = to;
        var temp = map[kk];
        var dis = checkArr[temp];
        distance.push(dis);
    }
    return (distance);
}


//bestRoute(["target_headquarter", "pointB", "pointC", "pointA"])

function bestRoute(path) {
    var bestRoute = ["target_headquarter"];
    tempObj = {};
    var tempArr = routeDistance(path);
    for (i = 0; i <= tempArr.length - 1; i++) {
        tempObj[tempArr[i]] = path[i + 1];
    }
    _.forOwn(tempObj, function (value, key) {
        bestRoute.push(value)
    });
    return (bestRoute);
}

module.exports = router;
/*
{
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



var users = [ { _id: '1',
team_member_id: '1',
gender: 'M',
drop_point: 'pointC' },
{ _id: '2',
team_member_id: '2',
gender: 'F',
drop_point: 'pointC' },
{ _id: '4',
team_member_id: '4',
gender: 'M',
drop_point: 'pointC' },
{ _id: '3',
team_member_id: '3',
gender: 'M',
drop_point: 'pointA' },
{ _id: '5',
team_member_id: '5',
gender: 'F',
drop_point: 'pointD' },
{ _id: '6',
team_member_id: '6',
gender: 'M',
drop_point: 'pointD' } ]

var cab = [ { _id: 'cab2', id: 'cab2', cost: 1, capacity: 3 },
{ _id: 'cab4', id: 'cab4', cost: 1, capacity: 3 },
{ _id: 'cab6', id: 'cab6', cost: 1, capacity: 3 },
{ _id: 'cab1', id: 'cab1', cost: 2, capacity: 2 },
{ _id: 'cab3', id: 'cab3', cost: 2, capacity: 2 },
{ _id: 'cab5', id: 'cab5', cost: 2, capacity: 2 } ] 
*/