package main

import(
  models "bitbucket.org/fanky5g/labadipost/labadicommon"
  "gopkg.in/mgo.v2/bson"
  "github.com/labstack/echo"
  "github.com/icza/minquery"
  "strconv"
  "fmt"
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

// func DeleteNews(bson.ObjectId id) {

// }

// func DeleteCategory(bson.ObjectId id) {
//   // delete all child news stories
// }

// func EditCategory(fields map[string]interface{}) {
  
// }