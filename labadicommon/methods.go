package common

import (
  "gopkg.in/mgo.v2/bson"
  "gopkg.in/mgo.v2"
)

func (cat *Category) AddStoryRefs(itemRefs []bson.ObjectId) error {
  conn, err := ConnectMongo()
  defer conn.Close()
  if err != nil {
    return err
  }

  var refsArray []mgo.DBRef

  for _, val := range itemRefs {
    ref := mgo.DBRef{
      Collection: "Stories",
      Id: val,
      Database: "labadifeeds",
    }
    refsArray = append(refsArray, ref)
  }

  cat.Stories = refsArray
  return cat.Save()
}

func (cat *Category) AddSubcategory(subcategory string, imageURL string) (sub Subcategory, err error) {
  sub, subIncluded := cat.HasSubcategory(subcategory)

  if !subIncluded {
    sub, err = CreateSubcategory(subcategory, imageURL)
    if err != nil {
      return sub, err
    }

    ref := mgo.DBRef{
      Database: "labadifeeds",
      Collection: "Subcategories",
      Id: sub.Id,
    }

    cat.Subcategories = append(cat.Subcategories, ref)
    err = cat.Save()
    if err != nil {
      return sub, err
    }

    return sub, nil
  }

  return sub, nil
}

func (cat *Category) Save() error {
  conn, err := ConnectMongo()
  defer conn.Close()
  if err != nil {
    return err
  }
  c := conn.DB("labadifeeds").C("Categories")
  err = c.Update(bson.M{"name": cat.Name}, cat)
  if err != nil {
    return err
  }
  return nil
}

func (cat *Category) HasSubcategory(subcategory string) (Subcategory, bool) {
  found := false
  var sub Subcategory
  conn, err := ConnectMongo()
  defer conn.Close()
  if err != nil {
    return sub, false
  }

  for _, val := range cat.Subcategories {
    err := conn.FindRef(&val).One(&sub)
    if err.Error() != "not found" && err == nil {
      if sub.Type == subcategory {
        found = true
        break
      }
    }
  }

  if found {
    return sub, true
  }

  return sub, false
}

func CreateSubcategory(subcategory string, imageURL string) (sub Subcategory, err error) {
  conn, err := ConnectMongo()
  defer conn.Close()
  if err != nil {
    return sub, err
  }

  sub, err = FindSubcategory(subcategory)
  if ok := err != nil && err.Error() != "not found"; ok {
    return sub, err
  }

  if !IsEmpty(sub) {
    return sub, nil
  }

  id := bson.NewObjectId()
  sub = Subcategory{
    Id: id,
    Type: subcategory,
    Image: imageURL,
  }

  c := conn.DB("labadifeeds").C("Subcategories")
  err = c.Insert(sub)
  if err != nil {
    return sub, err
  }

  return sub, nil
}

func FindSubcategory(subcategory string) (sub Subcategory, err error) {
  conn, err := ConnectMongo()
  defer conn.Close()
  if err != nil {
    return sub, err
  }

  c := conn.DB("labadipost").C("Subcategories")
  err = c.Find(bson.M{"type": subcategory}).One(&sub)
  if err != nil {
    return sub, err
  }
  return sub, nil
}