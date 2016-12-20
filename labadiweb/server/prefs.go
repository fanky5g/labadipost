package main

import (
  models "bitbucket.org/fanky5g/labadipost/labadicommon"
  "gopkg.in/mgo.v2"
  "gopkg.in/mgo.v2/bson"
  "github.com/labstack/echo"
  "github.com/labstack/echo/engine/standard"
  "github.com/icza/minquery"
  "strconv"
  "encoding/gob"
)

type Pref struct {
  Id bson.ObjectId `json:"id"  bson:"id"`
  CategoryId bson.ObjectId  `json:"categoryId"  bson:"categoryId"`
  Name string `json:"name"  bson:"name"`
}

type Prefs []Pref

type PrefModel struct {
  UID bson.ObjectId `json:"uid"  bson:"uid,omitempty"`
  FbId string `json:"fbid"  bson:"fbid"`
  GId string `json:"gid"  bson:"gid"`
  TwitterId string `json:"twittid"  bson:"twittid"`
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

  var user Claims
  activeUser := c.Get("user")
  if activeUser != nil {
    user = activeUser.(Claims)
  }

  //@todo:user already has prefs for whatever reason-> remove all previous prefs

  if isEmpty(user) {
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
    FbId: user.FbId,
    GId: user.GId,
    TwitterId: user.TwitterId,
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

// paginating news
type NewsReturn struct {
  Cursor string `json:"cursor"`
  News []Story `json:"stories"`
}

type Story struct {
  models.News
  Subcategory models.Subcategory `json:"subcategory"`
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

  var prefs *Prefs
  p := c.Get("prefs")

  if p != nil {
    prefs = p.(*Prefs)
  }

  conn, err := ConnectMongo()
  defer conn.Close()
  if err != nil {
    return err
  }

  var q minquery.MinQuery
  if prefs != nil {
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
    
    q = minquery.New(conn.DB("labadifeeds"), "Stories", query).Sort("item.title").Limit(limit)
  } else {
      //@todo::fetch posts based on user timezone
      q = minquery.New(conn.DB("labadifeeds"), "Stories", nil).Sort("item.title").Limit(limit)
  }

  if cursor != "" {
    q = q.Cursor(cursor)
  }

  var stories []models.News
  var out []Story
  newCursor, err := q.All(&stories, "_id")

  if err != nil {
    c.Error(err)
    return nil
  }


  if len(stories) > 0 {
    for _, story := range stories {
      var subcat models.Subcategory
      err := conn.FindRef(&story.Subcategory).One(&subcat)
      if err != nil {
        c.Error(err)
        return nil
      }
      s := Story{
        News: story,
        Subcategory: subcat,
      }

      out = append(out, s)
    }
  }

  newsArray := NewsReturn{
    Cursor: newCursor,
    News: out,
  }

  c.JSON(200, newsArray)
  return nil
}

func (api *PrefRoutes) BaseMiddleware(page echo.HandlerFunc) echo.HandlerFunc {
  return func(c echo.Context) error {
    claims, err := UserFromContext(c)

    if err != nil {
      c.Error(err)
      return nil
    }

    if claims != nil {
      c.Set("user", *claims)
      // get user prefs and save to context
      prefs, err := GetUserPrefs(c)
      if err != nil {
        c.Error(err)
        return nil
      }
      c.Set("prefs", prefs)
    }

    if err == nil && claims == nil {
      c.Set("user", nil)
      prefs, err := GetUserPrefs(c)
      if err != nil {
        c.Error(err)
        return nil
      }
      c.Set("prefs", prefs)
    }

    return page(c)
  }
}

func (api *PrefRoutes) GetPrefs(c echo.Context) error{
    prefs, err := GetUserPrefs(c)
    if err != nil {
      c.Error(err)
      return nil
    }
    c.JSON(200, prefs)
    return nil
}

func GetUserPrefs(c echo.Context) (prefs *Prefs, err error) {
  //@todo:getuserprefs should also check prefs database
  var user Claims
  activeUser := c.Get("user")
  if activeUser != nil {
    user = activeUser.(Claims)
  }
  
  if isEmpty(user) {
    // check if visitor has saved preferences earlier
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
    } else {
      prefs = nil
    }
  } else {
    conn, err := ConnectMongo()
    if err != nil {
      return prefs, err
    }

    var p PrefModel
    var q *mgo.Query

    prefcol := conn.DB("labadipost").C("Preferences")

    if user.Id.Valid() {
      q = prefcol.Find(bson.M{"uid": user.Id})
    } else if user.FbId != "" {
      q = prefcol.Find(bson.M{"fbid": user.FbId, "provider": "https://facebook.com"})
    } else if user.GId != "" {
      q = prefcol.Find(bson.M{"gid": user.GId, "provider": "https://google.com"})
    } else if user.TwitterId != "" {
      q = prefcol.Find(bson.M{"twittid": user.TwitterId, "provider": "https://twitter.com"})
    }
    
    err = q.One(&p)
    if err != nil && err.Error() != "not found" {
      return nil, err
    }
    if len(p.Prefs) > 0 {
      prefs = &p.Prefs
    } else {
      prefs = nil
    }
  }

  return
}