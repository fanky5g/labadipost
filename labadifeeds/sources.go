package main

import (
  "github.com/tealeg/xlsx"
  "github.com/asaskevich/govalidator"
  "github.com/Techdevt/rss"
  "gopkg.in/mgo.v2/bson"
  "time"
  "fmt"
)

func GetFeedSources() (feedSources Sources) {
  feedSources, err := GetAllSources()
  if err != nil {
    panic(err)
  }

  if len(feedSources) == 0 {
    feedFile := "feeds2.xlsx"
    file, err := xlsx.OpenFile(feedFile)
    if err != nil {
      panic(err)
    }

    for _, sheet := range file.Sheets {
      for _, row := range sheet.Rows {
        agency, _ := row.Cells[0].String()
        url, _ := row.Cells[3].String()
        category, _ := row.Cells[4].String()
        subcategory, _ := row.Cells[5].String()
        shouldInclude, _ := row.Cells[6].String()
        include := shouldInclude == "TRUE"
        refresh := time.Now()

        if ok := govalidator.IsURL(url); ok {
          newCategory, err := CreateCategory(category, "https://labadipics.s3.amazonaws.com/category.png")
          if err != nil {
            panic(err)
          }

          if subcategory == "General" {
            subcategory = category + ":" + subcategory
          }

          sub, err := newCategory.AddSubcategory(subcategory, "https://labadipics.s3.amazonaws.com/subcategory.png")
          if err != nil {
            panic(err)
          }

          source := Source {
            URL: url,
            Include: include,
            Category: newCategory,
            Subcategory: sub,
            Agency: agency,
            Refresh: refresh,
            PrevItemMap: make(map[string]struct{}),
          }

          err = CreateSource(source)
          HandleError(err)
          feedSources = append(feedSources, source)
        }
      }
    }
  }
  return
}

func (s *Source) Get() {
  if !s.Refresh.After(time.Now()) {
    fmt.Println("Getting feed from source: ", s.URL)
    feed, err := rss.Fetch(s.URL)
    HandleError(err)
    if err == nil {
      if s.Category.Agency == "" {
        s.Category.Agency = s.Agency
        s.Category.AgencyImage = feed.Image.Url
        err = s.Category.Save()
        HandleError(err)
      }

      if s.Subcategory.Agency == "" {
        s.Subcategory.Agency = s.Agency
        s.Subcategory.AgencyImage = feed.Image.Url
        err = s.Subcategory.Save()
        HandleError(err)
      }

      f := NewFeed(feed, s.Agency, s.Category, s.Subcategory)
      f.Save(s.PrevItemMap)

      s.PrevItemMap = feed.ItemMap
      s.Refresh = feed.Refresh
      s.Save()

      job := Job{
        Payload: Payload{
          payload: f,
        },
      }
      JobQueue <- job
    }
  } else {
    // <-time.After(- time.Since(s.Refresh))
    // s.Get()

    // release worker...send job back to queue till its time is up
    job := Job{
      Payload: Payload{
        payload: s,
      },
    }
    JobQueue <- job
  }
}

func CreateSource(source Source) error {
  conn, err := ConnectMongo()
  defer conn.Close()
  if err != nil {
    return err
  }

  s, err := FindSource(source.URL)
  if ok := err != nil && err.Error() != "not found"; ok {
    return err
  }

  if !IsEmpty(s) {
    // source already exists
    return nil
  }

  c := conn.DB("labadifeeds").C("Sources")
  err = c.Insert(source)
  return err
}

func FindSource(url string) (source Source, err error){
  conn, err := ConnectMongo()
  defer conn.Close()
  if err != nil {
    return source, err
  }

  c := conn.DB("labadifeeds").C("Sources")
  err = c.Find(bson.M{"url": url}).One(&source)
  if err != nil {
    return source, err
  }
  return source, nil
}

func (s *Source) Save() error {
  conn, err := ConnectMongo()
  defer conn.Close()
  if err != nil {
    return err
  }
  
  c := conn.DB("labadifeeds").C("Sources")
  err = c.Update(bson.M{"url": s.URL}, s)
  if err != nil {
    return err
  }
  return nil
}

func GetAllSources() (feedSources Sources, err error){
  conn, err := ConnectMongo()
  defer conn.Close()
  if err != nil {
    return
  }

  c := conn.DB("labadifeeds").C("Sources")
  err = c.Find(nil).All(&feedSources)

  return
}