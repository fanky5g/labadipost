package main

import (
  "gopkg.in/mgo.v2/bson"
  models "bitbucket.org/fanky5g/labadipost/labadicommon"
)

type Category models.Category

func CreateCategory(category string, imageURL string) (newCat models.Category, err error) {
  conn, err := ConnectMongo()
  defer conn.Close()
  if err != nil {
    return newCat, err
  }

  found, err := FindCategory(category)
  if ok := err != nil && err.Error() != "not found"; ok {
    return newCat, err
  }

  if !IsEmpty(found) {
    return found, nil
  }

  newCat = models.Category{
    Name: category,
    Image: imageURL,
  }
  
  c := conn.DB("labadifeeds").C("Categories")
  err = c.Insert(newCat)
  return newCat, err
}

func FindCategory(category string) (cat models.Category, err error) {
  conn, err := ConnectMongo()
  defer conn.Close()
  if err != nil {
    return cat, err
  }

  c := conn.DB("labadifeeds").C("Categories")
  err = c.Find(bson.M{"name": category}).One(&cat)

  if err != nil {
    return cat, err
  }
  return cat, nil
}