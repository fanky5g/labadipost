package main

import (
  "golang.org/x/crypto/bcrypt"
  "gopkg.in/boj/redistore.v1"
  "gopkg.in/mgo.v2"
  "github.com/dgrijalva/jwt-go"
  "reflect"
  "errors"
  "os"
  "fmt"
)

// Must raises an error if it not nil
func Must(e error) {
	if e != nil {
		panic(e)
	}
}

func Encrypt(str string) (string, error){
  hash := []byte(str)

  hashedPassword, err := bcrypt.GenerateFromPassword(hash, bcrypt.DefaultCost)
  return string(hashedPassword[:]), err
}

func VerifyPass(hash string, against string) (bool, error) {
  err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(against))

  if err == nil {
    return true, nil
  }
  return false, err
}

func DecryptToken (token string) (*Claims, error) {
  t, err := jwt.ParseWithClaims(token, &Claims{}, func(tokenString *jwt.Token) (interface{}, error) {
    if _, ok := tokenString.Method.(*jwt.SigningMethodHMAC); !ok {
      return nil, fmt.Errorf("Unexpected siging method")    
    }    
    return []byte(os.Getenv("JWT_KEY")), nil
  })

  if err != nil {
    return &Claims{}, err
  }

  if claims, ok := t.Claims.(*Claims); ok && t.Valid {
    return claims, nil
  } else {
    return &Claims{}, errors.New("token parse failure")
  }
}

func ConnectMongo() (*mgo.Session, error) {
  return mgo.Dial(os.Getenv("MONGO_URL"))
}

func GetRedisStore() (*redistore.RediStore, error) {
  return redistore.NewRediStore(10, "tcp", os.Getenv("REDIS_URL_RAW"), "", []byte(os.Getenv("JWT_KEY")))
}

func isEmpty(object interface{}) bool {
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

func SendActivationEmail(email string, token string) error{
    templateData := struct {
      Link  string
    }{
       Link: "http://labadipost.com/api/v1/activate/" + token,
    }
    r := NewMailRequest([]string{email}, "Welcome to Labadipost", "")
  err := r.ParseTemplate("server/data/templates/welcome.html", templateData)
  if err == nil {
    _, err := r.SendEmail()
    return err
  }
  return err
}