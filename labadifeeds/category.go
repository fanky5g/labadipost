package main

import (
  "gopkg.in/mgo.v2/bson"
  models "bitbucket.org/fanky5g/labadipost/labadicommon"
  "fmt"
)

type Category models.Category

func CreateCategory(category string, imageURL string) (newCat models.Category, err error) {
  conn, err := ConnectMongo()
  defer conn.Close()
  if err != nil {
    return newCat, err
  }

  found, err := FindCategory(Trim(category))
  if ok := err != nil && err.Error() != "not found"; ok {
    return newCat, err
  }

  if !IsEmpty(found) {
    return found, nil
  }

  newCat = models.Category{
    Name: Trim(category),
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

func UpdateSubcategoryImage(image string, subcatId bson.ObjectId) {
  if image == "" {
    return
  }

  conn, err := ConnectMongo()
  if err != nil {
    fmt.Println(err)
  }
  
  subcol := conn.DB("labadifeeds").C("Subcategories")
  err = subcol.Update(bson.M{"_id": subcatId}, bson.M{"$set": bson.M{"image": image}})
  if err != nil {
    if err.Error() == "not found" {
      fmt.Println(err)
      return
    }
    fmt.Println(err)
    return
  }
  fmt.Println(subcatId)
}