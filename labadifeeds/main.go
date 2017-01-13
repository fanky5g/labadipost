package main

import (
  // "time"
  "strconv"
  "os"
  // "log"
  "fmt"
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
  select{}
}

func HandleError(err error) {
  if err != nil {
    // write logging mechanism here that will catch for errors
    // log.Println(err)
    fmt.Println(err)
  }
}