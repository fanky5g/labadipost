package main

import (
  // "time"
  "strconv"
  "os"
)

var (
  MaxWorker, _ = strconv.Atoi(os.Getenv("MAX_WORKERS"))
  MaxQueue, _  = strconv.Atoi(os.Getenv("MAX_QUEUE"))
)

var JobQueue = make(chan Job, MaxQueue)

func main() {
  sources := GetFeedSources()

  for _, source := range sources {
    work := Job{
      Payload: Payload{
        payload: source,
      },
    }
    JobQueue <- work
  }


  dispatcher := NewDispatcher(MaxWorker)
  dispatcher.Run()
}

func HandleError(err error) {
  if err != nil {
    // write logging mechanism here that will catch for errors
    panic(err)
  }
}

/*
  Todo:
    create a socket connection that will push to users livestream of newsfeed
    Reporters:
      Register reporters
      Let reporters add news items
      Reporters will be paid based on number of reads and amount of time users hang around to read their news items

*/
