package main

import (
  "os"
  "gopkg.in/labstack/echo"
  "golang.org/x/net/context"
  "golang.org/x/oauth2"
  "encoding/json"
  "net/http"
)

var fbClientId = os.Getenv("FB_ID")
var fbClientSecret = os.Getenv("FB_SECRET")

var FbOauthConfig = &oauth2.Config{
  ClientID:     fbClientId,
  ClientSecret: fbClientSecret,
  Scopes:       []string{"email", "public_profile"},
  RedirectURL: "http://labadipost.com/api/v1/oauth/fb/callback",
  Endpoint: oauth2.Endpoint{
      AuthURL:  "https://www.facebook.com/dialog/oauth",
      TokenURL: "https://graph.facebook.com/oauth/access_token",
  },
}

type FbPicture struct {
  Data struct {
    Is_Silhouette bool `json:"is_silhouette"`
    Url string `json:"url"`
  } `json:"data"`
}

type FbUserInfo struct {
  Username string `json:"name"`
  Email string `json:"email"`
  Firstname string `json:"first_name"`
  Lastname string `json:"last_name"`
  Avatar FbPicture `json:"picture"`
  FbId string `json:"id"`
}

func (api *API) FbOauthInitiate(c echo.Context) error{
  clientLocation := c.Query("location")

  url := FbOauthConfig.AuthCodeURL(clientLocation)
  c.Redirect(302, url)
  return nil
}

func (api *API) FbOauthCallback(c echo.Context) error {
  code := c.Form("code")
  clientLocation := c.Form("state")

  ctx := context.Background()
  token, err := FbOauthConfig.Exchange(ctx, code)
  if err != nil {
    c.Error(err)
  }

  tokenSource := FbOauthConfig.TokenSource(ctx, token)
  t := &oauth2.Transport{Source: tokenSource}
  req, _ := http.NewRequest("GET", "https://graph.facebook.com/me?fields=id,first_name,last_name,picture.type(large),name,email&type=normal", nil)

  response, err := t.RoundTrip(req)
  if err != nil {
    c.Error(err)
    return nil
  }

  var userInfo FbUserInfo

  if err := json.NewDecoder(response.Body).Decode(&userInfo); err != nil {
    c.Error(err)
    return nil
  }
  
  user := &User{
    Username: userInfo.Username,
    Email: userInfo.Email,
    Firstname: userInfo.Firstname,
    Lastname: userInfo.Lastname,
    Avatar: userInfo.Avatar.Data.Url,
    FbId: userInfo.FbId,
  }

  //save new oauth logins
  oauthUser, err := user.GetOauthUser("facebook")
  if err != nil && err.Error() != "not found" && oauthUser == nil {
    c.Error(err)
    return nil
  }

  if oauthUser == nil {
    user.OauthToken = AccessToken{
      Provider: "facebook",
      Id: user.TwitterId,
      FbToken: token,
    }
    if err := user.Save(); err == nil {
      clientLocation = clientLocation + "?nu=1"
    }
  }

  jwt, err := user.GenerateJWTToken("https://facebook.com")
  if err != nil {
    c.Error(err)
    return nil
  }

  store, err := GetRedisStore()
  defer store.Close()
  store.SetMaxAge(1*24*3600) //1d

  //store jwt to session store
  session, err := store.Get(c.Request(), "jwt-storage")
  if err != nil {
    c.Error(err)
    return nil
  }
  session.Values["auth-token"] = jwt
  if err = session.Save(c.Request(), c.Response()); err != nil {
    c.Error(err)
  }

  c.Redirect(302, clientLocation)
  return nil
}