package main

import (
  "time"
  "gopkg.in/mgo.v2/bson"
  models "bitbucket.org/fanky5g/labadipost/labadicommon"
)

type Payload struct {
  payload interface{}
}

type Subcategory models.Subcategory
type News        models.News
type Feed        models.Feed

type Source struct {
  Id  bson.ObjectId `json:"id"  bson:"_id,omitempty"`
  URL string `json:"url"  bson:"url"`
  Include bool `json:"include"  bson:"include"`
  Category models.Category `json:"category"  bson:"category"`
  Subcategory models.Subcategory `json:"subcategory"  bson:"subcategory"`
  Agency string `json:"agency"  bson:"agency"`
  Refresh time.Time  `json:"refresh"  bson:"refresh"`
  PrevItemMap map[string]struct{}  `json:"previtems"  bson:"previtems"`
}

type Sources []Source
type Feeds []models.Feed