package main

import (
  models "bitbucket.org/fanky5g/labadipost/labadicommon"
  "gopkg.in/mgo.v2"
  "gopkg.in/mgo.v2/bson"
  "github.com/labstack/echo"
  "github.com/labstack/echo/engine/standard"
  "github.com/icza/minquery"
  "strconv"
  "strings"
  "encoding/gob"
)

type Pref struct {
  Id bson.ObjectId `json:"id"  bson:"id"`
  CategoryId bson.ObjectId  `json:"categoryId"  bson:"categoryId"`
  Name string `json:"name"  bson:"name"`
}

type Prefs []Pref

type PrefModel struct {
  UID bson.ObjectId `json:"uid"  bson:"uid"`
  Provider string `json:"provider"  bson:"provider"`
  Prefs Prefs `json:"prefs"  bson:"prefs"`
}

func init() {
  gob.Register(&Pref{})
  gob.Register(&Prefs{})
}

func (api *PrefRoutes) SaveUserPrefs(c echo.Context) error {
  var prefBody Prefs
  err := c.Bind(&prefBody)
  if err != nil {
    c.Error(err)
    return nil
  }

  var user *Claims
  activeUser := c.Get("user")
  if activeUser != nil {
    user = activeUser.(*Claims)
  } else {
    user = nil
  }

  if user == nil {
    // save user preferences to session
    store, err := GetRedisStore()
    defer store.Close()
    store.SetMaxAge(7*24*3600) //1 week

    session, err := store.Get(c.Request().(*standard.Request).Request, "prefs-storage")
    if err != nil {
      c.Error(err)
      return nil
    }

    session.Values["user-prefs"] = prefBody
    if err = session.Save(c.Request().(*standard.Request).Request, c.Response().(*standard.Response).ResponseWriter); err != nil {
      c.Error(err)
      return nil
    }

    c.NoContent(200)
    return nil
  }

  // save user preferences to database
  conn, err := ConnectMongo()
  if err != nil {
    c.Error(err)
    return nil
  }

  prefcol := conn.DB("labadipost").C("Preferences")
  objToSave := PrefModel{
    UID: user.Id,
    Provider: user.StandardClaims.Issuer,
    Prefs: prefBody,
  }

  //@todo::write a function to merge preferences if already found
  err = prefcol.Insert(objToSave)
  if err != nil {
    c.Error(err)
    return nil
  }

  c.NoContent(200)
  return nil
}

func (api *PrefRoutes) GetNews(c echo.Context) error{
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

  //@todo:getuserprefs should also check prefs database
  prefs, err := GetUserPrefs(c)
  if err != nil {
    c.Error(err)
    return nil
  }

  conn, err := ConnectMongo()
  defer conn.Close()
  if err != nil {
    return err
  }

  var q minquery.MinQuery

  if !isEmpty(prefs) {
    query := bson.M{}
    query["$or"] = []bson.M{}

    for _, pref := range *prefs {
      ref := mgo.DBRef{
        Database: "labadifeeds",
        Id: pref.Id,
        Collection: "Subcategories",
      }
      query["$or"] = append(query["$or"].([]bson.M), bson.M{"subcategory": ref})
    }
    
    q = minquery.New(conn.DB("labadifeeds"), "Stories", query).Sort("title", "_id").Limit(limit)
  } else {
      q = minquery.New(conn.DB("labadifeeds"), "Stories", nil).Sort("title", "_id").Limit(limit)
  }

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

func (api *PrefRoutes) BaseMiddleware(page echo.HandlerFunc) echo.HandlerFunc {
  return func(c echo.Context) error {
    AuthHeader := c.Request().Header().Get("Authorization")

    if len(AuthHeader) == 0 {
      c.Set("user", nil)
      return page(c)
    }

    //feels like hackery to get token..find a better way
    token := strings.TrimSpace(strings.Split(string(AuthHeader[:]), "Bearer")[1])
    claims, err := DecryptToken(token)

    if err != nil {
      errorMsg := struct {
        Message string `json:"message"`
      }{
        Message: "unauthorized to access resource",
      }
      c.JSON(401, errorMsg)
      return nil
    }

    c.Set("user", *claims)
    return page(c)
  }
}

func UserHasPrefs(c echo.Context) bool {
  store, err := GetRedisStore()
  defer store.Close()
  if err != nil {
    return false
  }

  session, err := store.Get(c.Request().(*standard.Request).Request, "prefs-storage")
  if err != nil {
    return false
  }

  prefs := session.Values["user-prefs"]
  
  if ok := prefs != nil; ok {
    return true
  }
  return false
}

func GetUserPrefs(c echo.Context) (prefs *Prefs, err error) {
  store, err := GetRedisStore()
  defer store.Close()
  if err != nil {
    return prefs, nil
  }

  session, err := store.Get(c.Request().(*standard.Request).Request, "prefs-storage")
  if err != nil {
    return prefs, nil
  }

  userPrefs := session.Values["user-prefs"]
  
  if ok := userPrefs != nil; ok {
    prefs = userPrefs.(*Prefs)
  }

  return
}