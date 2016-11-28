package main

import (
  "time"
  "github.com/Techdevt/rss"
  "gopkg.in/mgo.v2/bson"
  models "bitbucket.org/fanky5g/labadipost/labadicommon"
)

type Payload struct {
  payload interface{}
}

type Subcategory models.Subcategory
type News        models.News

type Source struct {
  Id  bson.ObjectId `json:"id"  bson:"_id,omitempty"`
  URL string `json:"url"  bson:"url"`
  Include bool `json:"include"  bson:"include"`
  Category Category `json:"category"  bson:"category"`
  Subcategory Subcategory `json:"subcategory"  bson:"subcategory"`
  Agency string `json:"agency"  bson:"agency"`
  Refresh time.Time  `json:"refresh"  bson:"refresh"`
  PrevItemMap map[string]struct{}  `json:"previtems"  bson:"previtems"`
}

type Feed struct {
  *rss.Feed
  Id          bson.ObjectId `json:"id"  bson:"_id,omitempty"`
  Agency      string              `json:"agency"  bson:"agency"`
  Category    Category           `json:"category" bson:"category"`
  Subcategory Subcategory        `json:"subcategory"  bson:"subcategory"`  
}

type Sources []Source
type Feeds []Feed