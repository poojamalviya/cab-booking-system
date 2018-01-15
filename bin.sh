

function start(){
    echo "starting the micorservice"
     cd /Users/poojamalviya/Desktop/myStuff/git_root/cabBookingService/letMe
     node app.js
}
if [ $1 == "start" ]
then
   start
fi