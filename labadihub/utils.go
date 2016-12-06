package main

import (
  "github.com/streadway/amqp"
  "log"

  "os"
  // "fmt"
  // "encoding/json"
)

func RabbitMQConnect() (*amqp.Connection, error) {
  return amqp.Dial(os.Getenv("RABBITMQ_URL"))
}

func ListenToQueue(name string) {
  conn, err := RabbitMQConnect()

  if err != nil {
    panic(err)
  }

  defer conn.Close()

  ch, err := conn.Channel()
  if err != nil {
    panic(err)
  }
  
  q, err := ch.QueueDeclare(
    name,
    false,
    false,
    false,
    false,
    nil,
  )

  if err != nil {
    panic(err)
  }

  msgs, err := ch.Consume(q.Name, "", true, false, false, false, nil)

  forever := make(chan bool)

  go func() {
  for d := range msgs {
      // payload, err := json.Marshal(d.Body)
      // if err != nil {
      //   log.Println(err)
      // }
      h.broadcast <- message{d.Body, "electionlive"}
    }
  }()

  log.Printf(" [*] Waiting for messages from queue " + name)
  <-forever
}