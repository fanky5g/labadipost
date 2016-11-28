// Copyright 2013 The Gorilla WebSocket Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

// package labadihub

// import (
//   "encoding/json"
//   "log"
//   "net/http"
//   "time"

//   "github.com/gorilla/websocket"
// )

// const (
//   writeWait = 10 * time.Second
//   pongWait = 60 * time.Second
//   pingPeriod = (pongWait * 9) / 10
//   maxMessageSize = 512
// )

// var upgrader = websocket.Upgrader{
//   ReadBufferSize:  1024,
//   WriteBufferSize: 1024,
// }

// type Client struct {
//   hub *Hub
//   conn *websocket.Conn
//   send chan *Message
// }

// func (c *Client) readPump() {
//   defer func() {
//     c.hub.unregister <- c
//     c.conn.Close()
//   }()

//   c.conn.SetReadLimit(maxMessageSize)
//   c.conn.SetReadDeadline(time.Now().Add(pongWait))
//   c.conn.SetPongHandler(func(string) error { c.conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })

//   for {
//     _, message, err := c.conn.ReadMessage()
//     if err != nil {
//       if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway) {
//         log.Printf("error: %v", err)
//       }
//       break
//     }
    
//     c.hub.broadcast <- message
//   }
// }

// func (c *Client) writePump() {
//   ticker := time.NewTicker(pingPeriod)

//   defer func() {
//     ticker.Stop()
//     c.conn.Close()
//   }()

//   for {
//     select {
//     case message := <-c.send:
//       c.conn.SetWriteDeadline(time.Now().Add(writeWait))

//       w, err := c.conn.NextWriter(websocket.TextMessage)
//       if err != nil {
//         return
//       }

//      //json encode message first before send
//       p, err := json.Marshal(message)
//       if err != nil {
//         c.conn.WriteMessage(websocket.CloseMessage, []byte{})
//         return
//       }
//       w.WriteJSON(message)

//       if err := w.Close(); err != nil {
//         return
//       }
//     case <-ticker.C:
//       c.conn.SetWriteDeadline(time.Now().Add(writeWait))
//       if err := c.conn.WriteMessage(websocket.PingMessage, []byte{}); err != nil {
//         return
//       }
//     }
//   }
// }

// func serveWs(hub *Hub, w http.ResponseWriter, r *http.Request) {
//   conn, err := upgrader.Upgrade(w, r, nil)
//   if err != nil {
//     log.Println(err)
//     return
//   }
//   client := &Client{hub: hub, conn: conn, send: make(chan *Message)}
//   client.hub.register <- client
//   go client.writePump()
//   client.readPump()
// }


package main

// import (
//   "fmt"
//   "log"
//   "os"
//   "strconv"
//   "sync/atomic"
//   "time"

//   "github.com/garyburd/redigo/redis"
//   "github.com/gorilla/websocket"
// )

// const (
//   idleTimeout    = 6 * time.Minute
//   maxMessageSize = 256
//   maxPending     = 1024
// )

// var dialer = &websocket.Dialer{
//   ReadBufferSize:  maxMessageSize,
//   WriteBufferSize: 16,
// }

// var (
//   connected int64
//   pending   int64
//   failed    int64
// )

// func main() {
//   go func() {
//     start := time.Now()
//     for {
//       fmt.Printf("client elapsed=%0.0fs pending=%d connected=%d failed=%d\n", time.Now().Sub(start).Seconds(), atomic.LoadInt64(&pending), atomic.LoadInt64(&connected), atomic.LoadInt64(&failed))
//       time.Sleep(1 * time.Second)
//     }
//   }()

//   host := os.Args[1]

//   desired, err := strconv.ParseInt(os.Args[2], 10, 64)
//   if err != nil {
//     log.Fatal(err)
//   }

//   go latency()

//   port := 10000
//   i := 0
//   for {
//     if atomic.LoadInt64(&connected)+atomic.LoadInt64(&pending) < desired && atomic.LoadInt64(&pending) < maxPending {
//       if i > 0 && i%50000 == 0 {
//         port++
//       }
//       atomic.AddInt64(&pending, 1)
//       url := fmt.Sprintf("ws://%s:%d/%d", host, port, i)
//       go createConnection(url)
//       i++
//     } else {
//       time.Sleep(100 * time.Millisecond)
//     }
//   }
// }

// func createConnection(url string) {
//   ws, _, err := dialer.Dial(url, nil)
//   if err != nil {
//     atomic.AddInt64(&pending, -1)
//     atomic.AddInt64(&failed, 1)
//     return
//   }

//   atomic.AddInt64(&pending, -1)
//   atomic.AddInt64(&connected, 1)

//   ws.SetReadLimit(maxMessageSize)

//   for {
//     ws.SetReadDeadline(time.Now().Add(idleTimeout))
//     _, message, err := ws.ReadMessage()
//     if err != nil {
//       break
//     }
//     if len(message) > 0 {
//       fmt.Println("received message", url, string(message))
//     }
//   }

//   atomic.AddInt64(&connected, -1)
//   atomic.AddInt64(&failed, 1)

//   ws.Close()
// }

// func latency() {
//   c, err := redis.Dial("tcp", os.Args[1]+":6379")
//   if err != nil {
//     log.Fatal(err)
//   }

//   hostname, err := os.Hostname()
//   if err != nil {
//     log.Fatal(err)
//   }

//   ws, _, err := websocket.DefaultDialer.Dial("ws://"+os.Args[1]+":10000/"+hostname, nil)
//   if err != nil {
//     log.Fatal(err)
//   }

//   ws.SetReadLimit(maxMessageSize)

//   i := 0
//   for {
//     i++
//     start := time.Now()
//     if _, err := c.Do("PUBLISH", hostname, strconv.Itoa(i)); err != nil {
//       log.Fatal(err)
//     }

//     var message []byte
//     for {
//       ws.SetReadDeadline(time.Now().Add(30 * time.Second))
//       _, message, err = ws.ReadMessage()
//       if err != nil {
//         log.Fatal(err)
//       }
//       if len(message) > 0 {
//         break
//       }
//     }
//     end := time.Now()
//     n, err := strconv.Atoi(string(message))
//     if err != nil {
//       log.Fatal(err)
//     }
//     if n != i {
//       log.Fatal("message mismatch")
//     }
//     fmt.Printf("latency %0.2fms\n", end.Sub(start).Seconds()*1000)
//     time.Sleep(5 * time.Second)
//   }
// }