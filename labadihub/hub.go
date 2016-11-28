package main

// import (
//   "log"
// )

// type Hub struct {
//   clients map[*Client]bool

//   // Register requests from the clients.
//   register chan *Client

//   // Unregister requests from clients.
//   unregister chan *Client

//   broadcast chan *Message
// }

// func NewHub() {
//   return &Hub{
//     clients:   map[*Client]bool,
//     register: make(chan *Client),
//     unregister: make(chan *Client),
//     broadcast: make(chan *Message),
//   }
// }

// func (h *Hub) run() {
//   for {
//     select {
//     case client := <-h.register:
//       h.clients[client] = true
//     case client := <-h.unregister:
//       if _, ok := h.clients[client]; ok {
//         delete(h.clients, client)
//         close(client.send)
//       }

//     case message := <-h.broadcast:
//       for client := range h.clients {
//         select {
//           case client.send <- message:
//           default:
//             close(client.send)
//             delete(h.clients, client)
//         }
//       }
//     case err := h.err:
//       log.Println("Error: ", err.Error())
//     case <-h.close:
//       return
//     }
//   }
// }

// func (h *Hub) AddClient(c *Client) {
//   h.register <- c
// }

// func (h *Hub) DeleteClient(c *Client) {
//   h.unregister <- c
// }

// func (h *Hub) Broadcast(msg *Message) {
//   h.message <- msg
// }