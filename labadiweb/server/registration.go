package main

import (
  "errors"
  "crypto/rand"
  "crypto/md5"
  "encoding/hex"
  "reflect"
  "time"
  "io"

  // "gopkg.in/mgo.v2"
  "gopkg.in/mgo.v2/bson"
)

func ensure(userObject *User, requiredFields []string) (e error) {
  user := reflect.ValueOf(userObject)
  for _, key := range requiredFields {
    if reflect.Indirect(user).FieldByName(key).String() == "" {
      // key not found set error
      e = errors.New("Required field " + key + " not found")
      break
    }
  }
  return
}

func Validate(user *User) error {
  requiredFields := []string{"Firstname", "Email", "Password", "Username"}

  err := ensure(user, requiredFields)
  return err
}

func CheckDuplicateEmail(email string) error {
  conn, err := ConnectMongo()
  c := conn.DB("labadipost").C("Users")
  count, err := c.Find(bson.M{"email": email}).Count()
  if err != nil {
    return err
  }
 
  if count > 0 {
    // user with email found
    return errors.New("Duplicate Email: " + email + " already registered")
  }

  return nil
}

func CheckDuplicateUsername(username string) error {
  conn, err := ConnectMongo()
  defer conn.Close()
  c := conn.DB("labadipost").C("Users")
  count, err := c.Find(bson.M{"username": username}).Count()
  if err != nil {
    return err
  }
 
  if count > 0 {
    // user with email found
    return errors.New(username + " already registered")
  }

  return nil
}

func ValidateUser(user interface{}) error {
  var checkuser *User
  if reflect.TypeOf(user).String() == "*main.User" {
    checkuser = user.(*User)
  } else {
    u := user.(*Admin)
    checkuser = u.User
  }

  if err := Validate(checkuser); err != nil {
    return err
  }

  if err := CheckDuplicateEmail(checkuser.Email); err != nil {
    return err
  }

  if err := CheckDuplicateUsername(checkuser.Username); err != nil {
    return err
  }

  return nil
}

func GenVerificationToken() (string, error){
  token := make([]byte, 21)
  _, err := rand.Read(token)

  if err != nil {
    return "", err
  }

  h := md5.New()
  io.WriteString(h, string(token[:]))

  return Encrypt(hex.EncodeToString(h.Sum(nil)))
}

func RegisterUser(user *User) (*User, error){
  //do validations
  var u User
  if err:= ValidateUser(user); err != nil {
    return &u, err
  }

  pass, err := Encrypt(user.Password)
  if err != nil {
    return &u, err
  }

  user.DateRegistered = time.Now()
  user.Password = pass
  user.Avatar = "https://labadipost.s3.amazonaws.com/gravatar.png"
  // save user
  if err := user.Save(); err != nil {
    return &u, err
  }

  if token, err := GenVerificationToken(); err == nil {
    // send email containing verification token // we'll implement verification later
    err = SendActivationEmail(user.Email, token)
    if err != nil {
      return &u, err
    }

    user.ActivationToken = token
    conn, _ := ConnectMongo()
    defer conn.Close()
    err = conn.DB("labadipost").C("Users").Update(bson.M{"email": user.Email}, user)
    if err != nil {
      return &u, err
    }
    return user, nil
  }
  
  return &User{}, errors.New("Token generation failure")
}

func RegisterAdmin(admin *Admin) (bool, error) {
  if err := ValidateUser(admin); err != nil {
    return false, err
  }

  admin.DateRegistered = time.Now()
  pass, err := Encrypt(admin.Password)
  if err != nil {
    return false, err
  }

  admin.Password = pass
  if admin.Role == "" {
    admin.Role = "basic"
  }

  if err := admin.Save(); err != nil {
    return false, err
  }

  // admin needs no verification, return
  return true, nil
}

func (u *User) Save() error {
  conn, err := ConnectMongo()
  defer conn.Close()
  c := conn.DB("labadipost").C("Users")

  err = c.Insert(u)
  if err != nil {
    return err
  }
  return nil
}

func (a *Admin) Save() error {
  conn, err := ConnectMongo()
  defer conn.Close()
  c := conn.DB("labadipost").C("Admins")
  
  err = c.Insert(a)
  if err != nil {
    return err
  }
  return nil
}