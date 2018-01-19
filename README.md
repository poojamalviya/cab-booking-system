# cab-booking-system

cab service for users to drop them to drop-points nearest to their home.
Each user has to register to the travel portal to avail this service and select the drop point. 
Travel team staff can configure the number of cabs available along with their cost and capacity. 
They also configure the available drop points, and their distance from office and also the distance from one drop point to another

POST /register
POST /cabs
POST /drop_points
GET /routeplan
GET /allocate

used cases:
All team members should be dropped to their drop points.
The generated route_plan should have minimum total_cost.

