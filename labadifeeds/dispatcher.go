package main

type Dispatcher struct {
  WorkerPool chan chan Job
  MaxWorkers int
}

func NewDispatcher(maxWorkers int) *Dispatcher {
  pool := make(chan chan Job, maxWorkers)
  return &Dispatcher{
    WorkerPool: pool,
    MaxWorkers: maxWorkers,
  }
}

func (d *Dispatcher) Run() {
  for i := 0; i < d.MaxWorkers; i++ {
    worker := NewWorker(d.WorkerPool)
    worker.Start()
  }
  go d.dispatch()
  select {} // make function block forever
}

func (d *Dispatcher) dispatch() {
  for {
    select {
      case jobChannel := <-d.WorkerPool:
        job := <-JobQueue
        go func(job Job) {
          jobChannel <- job
        }(job)
    }
  }
}