package main

import (
  "time"
  "gopkg.in/mgo.v2/bson"
)

type Admin struct {
  User
  Role string //type of role may be basic, userac or full //we'll implement functions for those later
}

type User struct {
  Id        bson.ObjectId `json:"id"  bson:"_id,omitempty"`
  GId       string        `json:"gid"  bson:"gid,omitempty"`
  FbId      string        `json:"fbid" bson:"fbid,omitempty"`
  TwitterId string        `json:"twittid"   bson:"twittid,omitempty"`
  Username  string        `json:"username"`
  Password  string        `json:"-"`
  OauthToken AccessToken  `json:"oauthtoken"`
  Firstname string        `json:"firstname"`
  Lastname  string        `json:"lastname"`
  Email     string        `json:"email"`
  Avatar    string        `json:"avatar"`
  DateRegistered time.Time `json:"registeredon"`
  ActivationToken  string   `json:"-"`
}