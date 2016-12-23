feeds fetch should be arranged by date..only latest fetched from database
sort feeds by date and then save latest image
grouping not done properly
preferences page..group subcategories based on agency
bottom bar with just two icons bookmark(pin) and like(love icon)..show like count
prefetch images(5 at a time)
layout->image and alpha problems

bookmarks
tryloadmore
feeds without any image will be put into another group as headlines -> scrolling -> with their source's icon by the side
redo web client header -> design header
do following concept on web client
related news -> web client

setup nodejs microservice for cover story posting
write a rabbitmq function to send news items into a queue where the websocket will fetch and push
  - done partially ? refine to use topics

nginx caching
delegate email sending to another server