package main

import(
  models "bitbucket.org/fanky5g/labadipost/labadicommon"
  "gopkg.in/mgo.v2/bson"
  "github.com/labstack/echo"
  "github.com/icza/minquery"
  "strconv"
  "fmt"
  "errors"
)

func GetCategory(catName string) (cat models.Category, stories []models.News, err error) {
  // populate first 15 child stories
  conn, err := ConnectMongo()
  defer conn.Close()
  if err != nil {
    return cat, stories, err
  }
  fmt.Println("get category done")

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

func (api *API) GetAllCategories(c echo.Context) error {
  conn, err := ConnectMongo()
  defer conn.Close()
  if err != nil {
    return err
  }

  var categories []models.Category

  collection := conn.DB("labadifeeds").C("Categories")
  err = collection.Find(nil).All(&categories)
  if err != nil {
    c.Error(err)
    return nil
  }
  c.JSON(200, categories)
  return nil
}


// paginating news
type NewsReturn struct {
  Cursor string `json:"cursor"`
  News []models.News `json:"stories"`
}

func (api *API) GetNews(c echo.Context) error{
  l := c.QueryParam("limit")
  cursor := c.QueryParam("cursor")

  var limit int

  if l != "" {
    count, err := strconv.Atoi(l)
    if err != nil {
      limit = 50
    }
    limit = count
  } else {
    limit = 50
  }

  conn, err := ConnectMongo()
  defer conn.Close()
  if err != nil {
    return err
  }

  q := minquery.New(conn.DB("labadifeeds"), "Stories", nil).Sort("title", "_id").Limit(limit)

  if cursor != "" {
    q = q.Cursor(cursor)
  }

  var stories []models.News
  newCursor, err := q.All(&stories, "_id")

  if err != nil {
    c.Error(err)
    return nil
  }

  newsArray := NewsReturn{
    Cursor: newCursor,
    News: stories,
  }

  c.JSON(200, newsArray)
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
  err = subcol.Update(bson.M{"_id": inputVars.Id}, bson.M{"image": inputVars.Image.Url})
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