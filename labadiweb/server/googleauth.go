package main

import (
  "os"
  "github.com/labstack/echo"
  "golang.org/x/net/context"
  "golang.org/x/oauth2"
  "encoding/json"
  "net/http"
)

var googleClientId = os.Getenv("GOOGLE_ID")
var googleClientSecret = os.Getenv("GOOGLE_SECRET")

var GoogleOauthConfig = &oauth2.Config{
  ClientID:     googleClientId,
  ClientSecret: googleClientSecret,
  Scopes:       []string{"https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/plus.me"},
  RedirectURL: "http://labadipost.com/api/v1/oauth/google/callback",
  Endpoint: oauth2.Endpoint{
      AuthURL:  "https://accounts.google.com/o/oauth2/auth",
      TokenURL: "https://accounts.google.com/o/oauth2/token",
  },
}

type GoogleUserInfo struct {
  Username string `json:"name"`
  Email string `json:"email"`
  Firstname string `json:"given_name"`
  Lastname string `json:"family_name"`
  Avatar string `json:"picture"`
  GId string `json:"id"`
}

func (api *API) GoogleOAuthInitiate(c echo.Context) error {
  clientLocation := c.Query("location")

  url := GoogleOauthConfig.AuthCodeURL(clientLocation)
  c.Redirect(302, url)
  return nil
}

func (api *API) GoogleOauthCallback(c echo.Context) error {
  code := c.Form("code")
  clientLocation := c.Form("state")

  ctx := context.Background()
  token, err := GoogleOauthConfig.Exchange(ctx, code)
  if err != nil {
    c.Error(err)
  }

  tokenSource := GoogleOauthConfig.TokenSource(ctx, token)
  t := &oauth2.Transport{Source: tokenSource}
  req, _ := http.NewRequest("GET", "https://www.googleapis.com/oauth2/v1/userinfo?alt=json", nil)

  response, err := t.RoundTrip(req)
  if err != nil {
    c.Error(err)
    return nil
  }

  var userInfo GoogleUserInfo

  if err := json.NewDecoder(response.Body).Decode(&userInfo); err != nil {
    c.Error(err)
    return nil
  }

  user := &User{
    Username: userInfo.Username,
    Email: userInfo.Email,
    Firstname: userInfo.Firstname,
    Lastname: userInfo.Lastname,
    Avatar: userInfo.Avatar,
    GId: userInfo.GId,
  }

  //save new oauth logins
  oauthUser, err := user.GetOauthUser("google")
  if err != nil && err.Error() != "not found" && oauthUser == nil {
    c.Error(err)
    return nil
  }

  if oauthUser == nil {
    user.OauthToken = AccessToken{
      Provider: "google",
      Id: user.TwitterId,
      GoogleToken: token,
    }
    if err := user.Save(); err == nil {
      clientLocation = clientLocation + "?nu=1"
    }
  }
  
  jwt, err := user.GenerateJWTToken("https://google.com")
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