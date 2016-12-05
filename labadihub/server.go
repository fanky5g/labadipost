package main

import (
  // "fmt"
  "log"
  "net/http"
  "strconv"
  "sync"
  "sync/atomic"
  "time"

  "github.com/gorilla/websocket"

)

const (
  maxMessageSize = 512
  pongWait     = 60 * time.Second
  pingPeriod = (pongWait * 9) / 10
  writeWait = 10 * time.Second
)

var upgrader = websocket.Upgrader{
  ReadBufferSize:  1024,
  WriteBufferSize: 1024,
}

var (
  subscriptions      = map[string][]chan []byte{}
  subscriptionsMutex sync.Mutex
)

var (
  connected int64
  failed    int64
)

type connection struct {
    ws *websocket.Conn
    send chan []byte
}

func (c *connection) write(mt int, payload []byte) error {
    c.ws.SetWriteDeadline(time.Now().Add(writeWait))
    return c.ws.WriteMessage(mt, payload)
}

func (s subscription) readPump() {
    c := s.conn
    defer func() {
        h.unregister <- s
        c.ws.Close()
    }()
    c.ws.SetReadLimit(maxMessageSize)
    c.ws.SetReadDeadline(time.Now().Add(pongWait))
    c.ws.SetPongHandler(func(string) error { c.ws.SetReadDeadline(time.Now().Add(pongWait)); return nil })
    for {
        _, msg, err := c.ws.ReadMessage()
        if err != nil {
            if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway) {
                log.Printf("error: %v", err)
            }
            break
        }
        m := message{msg, s.room}
        h.broadcast <- m
    }
}

func (s *subscription) writePump() {
    c := s.conn
    ticker := time.NewTicker(pingPeriod)
    defer func() {
        ticker.Stop()
        c.ws.Close()
    }()
    for {
        select {
        case message, ok := <-c.send:
            if !ok {
                c.write(websocket.CloseMessage, []byte{})
                return
            }
            if err := c.write(websocket.TextMessage, message); err != nil {
                return
            }
        case <-ticker.C:
            if err := c.write(websocket.PingMessage, []byte{}); err != nil {
                return
            }
        }
    }
}

func main() {
  http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
    ws, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
      return
    }

    channel := r.URL.Path[1:]
    // launch a new goroutine so that this function can return and the http server can free up
    // buffers associated with this connection
    go handleConnection(ws, channel)
  })

  for i := 0; i < 100; i++ {
    i := i
    go func() {
      if err := http.ListenAndServe(":"+strconv.Itoa(10000+i), nil); err != nil {
        log.Fatal(err)
      }
    }()
  }

  go ListenToQueue("electionlive")
  h.run()
}

func handleConnection(ws *websocket.Conn, channel string) {
  atomic.AddInt64(&connected, 1)

  c := &connection{send: make(chan []byte, 256), ws: ws}
  s := subscription{c, channel}
  h.register <- s
  go s.writePump()
  s.readPump()

  atomic.AddInt64(&connected, -1)
  atomic.AddInt64(&failed, 1)
}