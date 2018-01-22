# cab-booking-system
____

cab service for users to drop them to drop-points nearest to their home.
Each user has to register to the travel portal to avail this service and select the drop point. 
Travel team staff can configure the number of cabs available along with their cost and capacity. 
They also configure the available drop points, and their distance from office and also the distance from one drop point to another

## POST /register
registers user details

## POST /cabs
adds the cabs available to the db

## POST /drop_points
adds the drop point, route distance for different locations

## GET /allocate
allocate cabs to the users once all data is posted in the db

## GET /routeplan
gives the route plan with total cost

## use cases:
All team members should be dropped to their drop points.
The generated route_plan should have minimum total_cost.




