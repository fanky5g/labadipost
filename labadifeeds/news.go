package main

import (
  "github.com/Techdevt/rss"
  "gopkg.in/mgo.v2/bson"
  "fmt"
  "io"
  "net/http"
  "image"
  "image/gif"
  "image/jpeg"
  "image/png"
)

func init() {
  image.RegisterFormat("jpeg", "jpeg", jpeg.Decode, jpeg.DecodeConfig)
  image.RegisterFormat("png", "png", png.Decode, png.DecodeConfig)
  image.RegisterFormat("gif", "gif", gif.Decode, gif.DecodeConfig)
}

func (f *Feed) SaveItems(parent string, prevItemMap map[string]struct{}) (itemRefs []bson.ObjectId, err error) {
  newItems := f.FindNewItems(prevItemMap)

  fmt.Println("Saving News stories", len(newItems))

  if len(newItems) > 0 {
    conn, err := ConnectMongo()
    defer conn.Close()
    if err != nil {
      return itemRefs, err
    }

    latest := newItems[newItems.Len() -1]
    go UpdateSubcategoryImage(latest.Image, f.Subcategory.Id.(bson.ObjectId))

    c := conn.DB("labadifeeds").C("Stories")

    for i:=0; i<len(newItems); i++ {
      item := newItems[i]
      id := bson.NewObjectId()


      // w, h, err := GetImageDimensions(item.Image)

      // if err != nil {
      //   return itemRefs, err
      // }
      // skip fetching images to save data in local environment
      w := 0
      h := 0

      if item.Title == "" && item.Summary == "" {
        continue
      }

      news := &News{
        Item: &rss.Item{
          Title: item.Title,
          Summary: item.Summary,
          Content: item.Content,
          Link: item.Link,
          Date: item.Date,
          ID: item.ID,
          Enclosures: item.Enclosures,
          Read: item.Read,
          Image: item.Image,
          Origin: item.Origin,
        },
        Id: id,
        Parent: parent,
        Category: f.Category,
        Subcategory: f.Subcategory,
        Agency: f.Agency,
        AgencyImage: f.Feed.Image.Url,
        ImageWidth: w,
        ImageHeight: h,
      }

      err = c.Insert(bson.M{
        "_id": id,
        "item": news.Item,
        "parent": news.Parent,
        "category": news.Category,
        "subcategory": news.Subcategory,
        "agency": news.Agency,
        "agencyimage": f.Feed.Image.Url,
        "imagewidth": news.ImageWidth,
        "imageheight": news.ImageHeight,
      })

      if err != nil {
        return itemRefs, err
      }

      itemRefs = append(itemRefs, id)
      // push to rabbitmq news queue
    }
  }

  return itemRefs, nil
}

func (f *Feed) FindNewItems(prevItemMap map[string]struct{}) (rss.Items){
  var newItems []*rss.Item
  for _, item := range f.Items {
    if _, ok := prevItemMap[item.ID]; !ok {
      newItems = append(newItems, item)
    }
  }
  return newItems
}

func GetNewsById() (stories []News, err error) {
  conn, err := ConnectMongo()
  defer conn.Close()
  if err != nil {
    return stories, err
  }

  c := conn.DB("labadifeeds").C("Stories")
  err = c.Find(nil).All(&stories)
  return
}

func ImageSize(e image.Image) (int, int) {
  return e.Bounds().Max.X, e.Bounds().Max.Y
}

func GetImageDimensions(url string) (int, int, error) {
  var r io.Reader
  if url == "" {
    return 0, 0, nil
  }
  req, err := http.Get(url)
  
  if err != nil {
    return 0, 0, err
  }

  r = req.Body
  image, _, err := image.Decode(r)
  if err != nil {
    return 0, 0, err
  }

  width, height := ImageSize(image)
  return width, height, nil
}