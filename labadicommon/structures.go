package common

import (
  "github.com/Techdevt/rss"
  "gopkg.in/mgo.v2/bson"
  "gopkg.in/mgo.v2"
)

type News struct {
  *rss.Item
  Id         bson.ObjectId `json:"id"  bson:"_id,omitempty"`
  Parent     string       `json:"parent"  bson:"parent"`
  Category   Category       `json:"category"  bson:"category"`
  Subcategory mgo.DBRef      `json:"subcategory"  bson:"subcategory"`
  ImageWidth  int      `json:"imagewidth"   bson:"imagewidth"`
  ImageHeight int      `json:"imageheight"   bson:"imageheight"`
  Agency      string   `json:"agency" bson:"agency"`
  AgencyImage string   `json:"agencyImage" bson:"agencyimage"`
  LikeCount   int      `json:"likeCount"  bson:"likeCount"`
  Likes       []bson.ObjectId  `json:""  bson:"likes"`
}

type Subcategory struct {
  Id bson.ObjectId `json:"id"  bson:"_id,omitempty"`
  Type string `json:"type"  bson:"type"`
  Image string `json:"image"  bson:"image"`
  Agency      string   `json:"agency" bson:"agency"`
  AgencyImage string   `json:"agencyImage" bson:"agencyimage"`
}

type Category struct {
  Id bson.ObjectId `json:"id"  bson:"_id,omitempty"`
  Name string  `json:"name"  bson:"name"`
  Agency      string   `json:"agency" bson:"agency"`
  AgencyImage string   `json:"agencyImage" bson:"agencyimage"`
  Image string `json:"image"  bson:"image"`
  Subcategories []mgo.DBRef `json:"subcategories"  bson:"subcategories"`
  Stories []mgo.DBRef `json:"stories"  bson:"stories"`
}

type Feed struct {
  *rss.Feed
  Id          bson.ObjectId `json:"id"  bson:"_id,omitempty"`
  Agency      string              `json:"agency"  bson:"agency"`
  Category    Category           `json:"category" bson:"category"`
  Subcategory mgo.DBRef        `json:"subcategory"  bson:"subcategory"`  
}