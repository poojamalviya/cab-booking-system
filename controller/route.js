var express = require('express'),
    Promise = require('bluebird'),
    _ = require('lodash'),
    error = require('../services/error'),
    db = require('../services/db'),
    id = require('shortid'),
    router = express.Router();


/**
 * get - /route_plan ==>> get the route plan as array of route plan and total cost
 * @param  {object} req
 * @param  {object} res 
 * returns promise with the object 
 */
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
            return resolve(res.status(200).send(result));
        }).catch(function (err) {
            return reject(err)
        })
    })
})

/**
 * groupBy get all the users and 
 * group them according to their drop points
 */
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


/**
 * get - /allocate
 * @param  {object} req
 * @param  {object} res
 * returns promise with the array of route plan and total cost
 */
router.get('/allocate', function (req, res) {
    return new Promise(function (resolve, reject) {
        var routes = [];
        var routeObj = {};
        var allUser = [];
        var dropPoint;
        var i = 0;
        db.findAll("DropPoint").then(function (drop) {
            dropPoint = drop;
            return groupBy();
        }).then(function (_allUser) {
            allUser = _allUser;
            return db.findAll("Cabs");
        }).then(function (_cab) {
            var cab = _.orderBy(_cab, ['capacity'], ['desc']);
            var length = allUser.length;
            if (allUser.length == 0) {
                return reject(error.sendError("badRequest", res, "there are no user"));
            }
            var teammemberid = [];
            var path = ["target_headquarter"];
            _.each(allUser, function (obj) {
                teammemberid.push(obj.team_member_id)
                path.push(obj.drop_point);
                var isLastItem = obj.team_member_id == allUser[length - 1].team_member_id
                if (cab[i].capacity == undefined) {
                    return reject(error.sendError("badRequest", res, "there are not enough cabs"));
                }
                if (teammemberid.length == cab[i].capacity || (teammemberid.length < cab[i].capacity && isLastItem)) {
                    var cost = routeCost(path, dropPoint);
                    var bestRoutePath = bestRoute(path, dropPoint);
                    routeObj = {
                        "cab_id": cab[i].id,
                        "team_member_ids": teammemberid,
                        "route": bestRoutePath,
                        "route_cost": _.sum(cost) * cab[i].cost
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
            return db.insertMany('Route', routes);
        }).then(function (response) {
            return resolve(res.status(200).send("cabs are successfully allocated"));
        }).catch(function (err) {
            return reject(err);
        })
    });
})

/**
 * function routeDistance ==> check for the drop point and 
 * get distances from different points
 * @param {array} _path ==>> path for the particular cab
 * @param {array} drop ==>> array of the drop point distance
 * return array of distances for the route
 */
function routeDistance(_path, drop) {
    var path = _.uniq(_path);

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
        var checkArr = drop[0][curr];
        var to = path[i + 1]
        var temp = map[to];
        var dis = checkArr[temp];
        distance.push(dis);
    }
    return (distance);
}

/**
 * function bestRoute ==>> sort the drop point according to distance and 
 * provice the best route plan
 * @param {array} path ==>> path for the particular cab
 * @param {array} drop ==>> array of the drop point distance
 * return array of drop poins for the route
 */
function bestRoute(path, drop) {
    var bestRoute = [];
    tempObj = {};
    var tempArr = routeDistance(path, drop);
    for (i = 0; i <= tempArr.length - 1; i++) {
        tempObj[path[i + 1]] = tempArr[i];
    }
    _.forOwn(tempObj, function (value, key) {
        bestRoute.push(key)
    });
    bestRoute = Object.keys(tempObj).sort((a, b) => tempObj[a] - tempObj[b]);
    bestRoute.unshift("target_headquarter")
    return (bestRoute);
}

/**
 * function ==>> gets the route cost of best route 
 * @param {array} path ==>> path for the particular cab
 * @param {array} drop ==>> array of the drop point distance
 * return array of the distance of routes
 */
function routeCost(path, drop){
    var bestPath = bestRoute(path, drop);
    var cost = routeDistance(bestPath, drop);
    return (cost);
}

module.exports = router;




