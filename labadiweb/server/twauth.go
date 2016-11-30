package main

import (
  "os"
  "github.com/labstack/echo"
  "github.com/labstack/echo/engine/standard"
  "encoding/gob"
  "github.com/mrjones/oauth"
  "encoding/json"
  "strconv"
  "strings"
  // "gopkg.in/mgo.v2/bson"
  // "fmt"
)

var twClientId = os.Getenv("TWITTER_ID")
var twClientSecret = os.Getenv("TWITTER_SECRET")

var TwOauthConfig = oauth.NewConsumer(
  twClientId,
  twClientSecret,
  oauth.ServiceProvider{
    RequestTokenUrl:   "https://api.twitter.com/oauth/request_token",
    AuthorizeTokenUrl: "https://api.twitter.com/oauth/authorize",
    AccessTokenUrl:    "https://api.twitter.com/oauth/access_token",
  },
)

var token *oauth.RequestToken

type TwitterUserInfo struct {
  Username string `json:"screen_name"`
  Email string `json:"email"`
  Firstname string `json:"name"`
  Avatar string `json:"profile_image_url"`
  TwitterId int64 `json:"id"`
}

func (api *API) TwitterOauthInitiate(c echo.Context) error{
  clientLocation := c.QueryParam("location")
  gob.Register(&oauth.RequestToken{})

  requestToken, url, err := TwOauthConfig.GetRequestTokenAndUrl("http://labadipost.com/api/v1/oauth/twitter/callback")

  store, err := GetRedisStore()
  defer store.Close()
  store.SetMaxAge(1*2*3600)

  session, err := store.Get(c.Request().(*standard.Request).Request, "twitter-oauth-storage")
  if err != nil {
    c.Error(err)
    return nil
  }

  session.Values["request-token"] = requestToken
  session.Values["location"] = clientLocation
  if err = session.Save(c.Request().(*standard.Request).Request, c.Response().(*standard.Response).ResponseWriter); err != nil {
    c.Error(err)
    return nil
  }

  c.Redirect(302, url)
  return nil
}

func (api *API) TwitterOauthCallback(c echo.Context) error {
  gob.Register(&oauth.RequestToken{})
  gob.Register(&oauth.AccessToken{})
  // oauth_token := c.Form("oauth_token")
  oauth_verifier := c.FormValue("oauth_verifier")

  store, err := GetRedisStore()
  defer store.Close()

  session, err := store.Get(c.Request().(*standard.Request).Request, "twitter-oauth-storage")
  if err != nil {
    c.Error(err)
    return nil
  }
  
  requestToken := session.Values["request-token"]
  clientLocation := session.Values["location"]

  accessToken, err := TwOauthConfig.AuthorizeToken(requestToken.(*oauth.RequestToken), oauth_verifier)
  if err != nil {
    c.Error(err)
    return nil
  }

  client, err := TwOauthConfig.MakeHttpClient(accessToken)
  if err != nil {
    c.Error(err)
    return nil
  }

  response, _ := client.Get("https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true&skip_status=true&include_entities=false")

  var userInfo TwitterUserInfo

  if err := json.NewDecoder(response.Body).Decode(&userInfo); err != nil {
    c.Error(err)
    return nil
  }
  
  user := &User{
    Username: userInfo.Username,
    Email: userInfo.Email,
    Firstname: userInfo.Firstname,
    Avatar: strings.Replace(userInfo.Avatar, "_normal", "", -1),
    TwitterId: strconv.FormatInt(userInfo.TwitterId, 10),
  }

  //save new oauth logins
  oauthUser, err := user.GetOauthUser("twitter")
  if err != nil && err.Error() != "not found" && oauthUser == nil {
    c.Error(err)
    return nil
  }

  if oauthUser == nil {
    user.OauthToken = AccessToken{
      Provider: "twitter",
      Id: user.TwitterId,
      TwitterToken: accessToken,
    }
    if err := user.Save(); err == nil {
      clientLocation = clientLocation.(string) + "?nu=1"
    }
  }

  jwt, err := user.GenerateJWTToken("https://twitter.com")
  if err != nil {
    c.Error(err)
    return nil
  }

  jwtSession, err := store.Get(c.Request().(*standard.Request).Request, "jwt-storage")
  if err != nil {
    c.Error(err)
    return nil
  }

  jwtSession.Values["auth-token"] = jwt
  jwtSession.Values["twitter-token"] = accessToken

  if err = jwtSession.Save(c.Request().(*standard.Request).Request, c.Response().(*standard.Response).ResponseWriter); err != nil {
    c.Error(err)
    return nil
  }

  c.Redirect(302, clientLocation.(string))
  return nil
}