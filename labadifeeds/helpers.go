package main

import (
  "github.com/garyburd/redigo/redis"
  "github.com/streadway/amqp"
  "gopkg.in/mgo.v2"
  "strconv"
  "os"
  "time"
  "reflect"
  "strings"
)

func RedisConnect() redis.Conn {
  c, err := redis.DialURL(os.Getenv("REDIS_URL"))
  HandleError(err)
  return c
}

func RabbitMQConnect() *amqp.Connection {
  conn, err := amqp.Dial(os.Getenv("RABBITMQ_URL"))
  HandleError(err)
  return conn
}

func GetNextUniqueId(field string) string {
  c := RedisConnect()
  defer c.Close()

  id, err := c.Do("HINCRBY", "unique_ids", field, 1)
  HandleError(err)
  return field + ":" + strconv.FormatInt(id.(int64), 10)
}

func ToMillisecs(t time.Time) int64{
  return t.UnixNano() / 1000000
}

func ConnectMongo() (*mgo.Session, error) {
  return mgo.Dial(os.Getenv("MONGO_URL"))
}

func IsEmpty(object interface{}) bool {
    //First check normal definitions of empty
    if object == nil {
        return true
    } else if object == "" {
        return true
    } else if object == false {
        return true
    }

    //Then see if it's a struct
    if reflect.ValueOf(object).Kind() == reflect.Struct {
        // and create an empty copy of the struct object to compare against
        empty := reflect.New(reflect.TypeOf(object)).Elem().Interface()
        if reflect.DeepEqual(object, empty) {
            return true
        }
    }
    return false
}

func NormalizeItemMap(itemMap map[string]struct{}) (out []string) {
  for id, _ := range itemMap {
    out = append(out, id)
  }
  return
}

func DenormalizeItemMap(in []string) (out map[string]struct{}) {
  out = make(map[string]struct{})
  for _, k := range in {
    out[k] = struct{}{}
  }
  return
}

func Trim(str string) string {
  return strings.TrimSpace(str)
}