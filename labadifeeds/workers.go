package main

import (
  "reflect"
)

type Job struct {
  Payload Payload
}

type Worker struct {
  WorkerPool  chan chan Job
  JobChannel  chan Job
  quit        chan bool
}

func NewWorker(workerPool chan chan Job) Worker {
  return Worker{
    WorkerPool: workerPool,
    JobChannel: make(chan Job),
    quit: make(chan bool),
  }
}

func (w *Worker) Start() {
  go func() {
    w.WorkerPool <- w.JobChannel
    for {
      select {
        case job := <-w.JobChannel:
          go func() {
            payload := job.Payload.payload
            if reflect.TypeOf(payload).String() == "main.Source" {
              source := payload.(Source)
              source.Get()
              w.WorkerPool <- w.JobChannel
            } else if reflect.TypeOf(payload).String() == "main.Feed" {
              feed := payload.(Feed)
              feed.SaveUpdates()
              w.WorkerPool <- w.JobChannel
            }
          }()
        case <-w.quit:
          return
      }
    }
  }()
}

func (w Worker) Stop() {
  go func() {
    w.quit <- true
  }()
}