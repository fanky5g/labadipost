package main

import (
  "github.com/Techdevt/rss"
  models "bitbucket.org/fanky5g/labadipost/labadicommon"
  "gopkg.in/mgo.v2"
  "fmt"
  "time"
)

func NewFeed(feed *rss.Feed, agency string, category models.Category, subcategory models.Subcategory) (out Feed) {
  subRef := mgo.DBRef{
    Database: "labadifeeds",
    Collection: "Subcategories",
    Id: subcategory.Id,
  }

  out = Feed {
    Feed: &rss.Feed {
      Nickname: feed.Nickname,
      Title: feed.Title,
      Description: feed.Description,
      Link: feed.Link,
      UpdateURL: feed.UpdateURL,
      Image: feed.Image,
      Items: feed.Items,
      ItemMap: feed.ItemMap,
      Refresh: feed.Refresh,
      Unread: feed.Unread,
      FetchFunc: feed.FetchFunc,
    },
    Agency: Trim(agency),
    Category: category,
    Subcategory: subRef,
  }
  return
}

func (f *Feed) Save(prevItems map[string]struct{}) error {
  conn, err := ConnectMongo()
  defer conn.Close()
  if err != nil {
    return err
  }

  itemRefs, err := f.SaveItems(f.Title, prevItems)
  if err != nil {
    return err
  }

  err = f.Category.AddStoryRefs(itemRefs)
  return err
}

func (feed Feed) SaveUpdates() {
  if !feed.Refresh.After(time.Now()) {
    fmt.Println("checking updates on", feed.UpdateURL)
    if err := feed.Update(); err != nil {
      HandleError(err)
    }

    // prevItemMap := make(map[string]struct{}) //make zero value previtemmap
    prevItemMap := feed.ItemMap
    source, err := FindSource(feed.UpdateURL)
    if err != nil {
      HandleError(err)
    }
    
    nItemMap := NormalizeItemMap(prevItemMap)
    if len(nItemMap) > 0 {
      source.NItemMap = nItemMap
    }

    source.Refresh = feed.Refresh
    source.Save()

    err = source.Save()
    if err != nil {
      HandleError(err)
    }

    err = feed.Save(prevItemMap)
    HandleError(err)

    job := Job{
      Payload: Payload{
        payload: feed,
      },
    }
    JobQueue <- job
  } else {
    // <-time.After(- time.Since(feed.Refresh))
    // feed.SaveUpdates()

    // send job back to queue to wait till its time is up..we don't want to block workers
    job := Job{
      Payload: Payload{
        payload: feed,
      },
    }
    JobQueue <- job
  }
}