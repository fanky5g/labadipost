<!-- setup image server -->
<!-- http://images.labadipost.com/display?url=https://cdn.pixabay.com/photo/2016/11/08/05/37/adult-1807554_960_720.jpg&w=500&h=300&op=resize&upscale=0 -->
<!-- setup bundle loader and code splitting for webpack -> couldn't still achieve that coupled with maintaining ssr -->

fix posts still saving duplicates feeds on server
finish admin changing of topics images - done - revisit later to add images for categories
list categories and topics on client -> let user explore or sign-in to save choices -> done preferences left user own
code following concept serverside -> partially done, left user own
allow user to login ->
redo web client header
do following concept on web client

write auth into server
setup nodejs microservice for cover story posting
design header
upload image
write a rabbitmq function to send news items into a queue where the websocket will fetch and push
  - done partially ? refine to use topics
write api endpoints for fetching feeds

title
link
if no image discard feed => write a verify feed function so that we add only supported feeds
    media:thumbnail pick image width and height as well
    media:group -> make sure to add this..make into slideshow component -> pick first one as cover or the one with the largest size rss feed image//add so we can highlight the source's icon at the top of the post
    enclosure:has no size
description -> if no content -> put description -> try to remove all html tags -> parse to markdown if possible
content
pubdate

feeds without any image will be put into another group as headlines -> scrolling -> with their source's icon by the side
remove html tags

rss2.0 creator tag -> posted by

add images size to feed
add media image group..check if not part of enclosures..if it is, add its image sizes
based on image size, we'll select a layout group for the news item...full=>1024width...

setup s3 local
dnsmasq
setup docker for all the layers
let labadifeeds only do finding feeds..saving to database..it wont handle any api
delegate all api requests to an api service
let labadipost be just the frontend which will call the api for data and also manage sockets


next.Image = getImageRss1(item)
next.Image = getImageRss2(item)

parentIcon
":6379"

nginx caching
time wait on workers?release?

delegate email sending to another server

setup admin ui
seed admin database
change subcategories into agency ie tv3, bbc, etc
category and subcategory image management -> editing
mobile view render header image, think of how hamburger button can happen
collect categories and subcategories into mobile view and render...make selection ticking happen and save to user preferences
mobile view render header image, think of how hamburger button can happen
