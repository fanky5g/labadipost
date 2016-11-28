package main

import (
  "github.com/Techdevt/rss"
  "fmt"
  "time"
)

func NewFeed(feed *rss.Feed, agency string, category Category, subcategory Subcategory) (out Feed) {
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
    Agency: agency,
    Category: category,
    Subcategory: subcategory,
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

    prevItemMap := make(map[string]struct{}) //make zero value previtemmap
    feed.Save(prevItemMap)

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