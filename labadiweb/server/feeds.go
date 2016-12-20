package main

import(
  models "bitbucket.org/fanky5g/labadipost/labadicommon"
  "gopkg.in/mgo.v2/bson"
  "gopkg.in/mgo.v2"
  "github.com/labstack/echo"
  "errors"
)

func GetCategory(catName string) (cat models.Category, stories []models.News, err error) {
  // populate first 15 child stories
  conn, err := ConnectMongo()
  defer conn.Close()
  if err != nil {
    return cat, stories, err
  }

  c := conn.DB("labadifeeds").C("Categories")
  err = c.Find(bson.M{"name": catName}).One(&cat)

  if ok := err != nil && err.Error() != "not found"; ok {
    return cat, stories, err
  }
  
  for _, ref := range cat.Stories {
    var story models.News
    q := conn.FindRef(&ref)
    err := q.One(&story)
    if err != nil && err.Error() != "not found" {
      return cat, stories, err
    }
    stories = append(stories, story)
  }

  return cat, stories, nil
}

type CategoryReturn struct{
  Id bson.ObjectId `json:"id"  bson:"_id,omitempty"`
  Name string  `json:"name"  bson:"name"`
  Image string `json:"image"  bson:"image"`
  Subcategories []models.Subcategory `json:"subcategories"  bson:"subcategories"`
  Stories []mgo.DBRef `json:"stories"  bson:"stories"  bson:"stories"`
}

func (api *API) GetAllCategories(c echo.Context) error {
  conn, err := ConnectMongo()
  defer conn.Close()
  if err != nil {
    return err
  }

  var categories []models.Category
  var categoryReturns []CategoryReturn

  collection := conn.DB("labadifeeds").C("Categories")
  err = collection.Find(nil).All(&categories)
  for _, cat := range categories {
    var subs []models.Subcategory
    for _, subcat := range cat.Subcategories {
      var sub models.Subcategory
      err := conn.FindRef(&subcat).One(&sub)
      if err != nil {
        c.Error(err)
        return nil
      }
      subs = append(subs, sub)
    }
    
    unitCat := CategoryReturn{
      Id: cat.Id,
      Name: cat.Name,
      Image: cat.Image,
      Subcategories: subs,
      Stories: cat.Stories,
    }
    categoryReturns = append(categoryReturns, unitCat)
  }
  if err != nil {
    c.Error(err)
    return nil
  }
  c.JSON(200, categoryReturns)
  return nil
}

type UploadImage struct {
  Filename string `json:"filename"`
  Height int `json:"height"`
  Width int `json:"width"`
  Path string `json:"path"`
  Url string `json:"url"`
}

type UploadSubcategoryInput struct {
  Id bson.ObjectId `json:"id"`
  Image UploadImage `json:"image"`
}

func (api *API) UpdateSubcategoryImage(c echo.Context) error {
  var inputVars UploadSubcategoryInput
  err := c.Bind(&inputVars)
  if err != nil {
    c.Error(err)
    return nil
  }

  conn, err := ConnectMongo()
  if err != nil {
    c.Error(err)
    return nil
  }

  subcol := conn.DB("labadifeeds").C("Subcategories")
  err = subcol.Update(bson.M{"_id": inputVars.Id}, bson.M{"$set": bson.M{"image": inputVars.Image.Url}})
  if err != nil {
    if err.Error() == "not found" {
      c.Error(errors.New("Subcategory not found"))
      return nil
    }
    c.Error(err)
    return nil
  }

  c.NoContent(200)
  return nil
}

// func DeleteNews(bson.ObjectId id) {

// }

// func DeleteCategory(bson.ObjectId id) {
//   // delete all child news stories
// }

// func EditCategory(fields map[string]interface{}) {
  
// }