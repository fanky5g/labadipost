package main

import (
	// "time"

	"github.com/labstack/echo"
)

type API struct{}
type AuthRoutes struct{}

// Bind attaches api routes
func (api *API) Bind(group *echo.Group) {
	group.GET("/v1/conf", api.ConfHandler)
  group.POST("/v1/signup", api.RegisterUser)
  group.GET("/v1/activate", api.ActivateUser)

  group.POST("/v1/auth", api.Login)
  group.POST("/v1/auth/logout", api.Logout)
  group.GET("/v1/oauth/google", api.GoogleOAuthInitiate)
  group.GET("/v1/oauth/google/callback", api.GoogleOauthCallback)
  group.GET("/v1/oauth/fb", api.FbOauthInitiate)
  group.GET("/v1/oauth/fb/callback", api.FbOauthCallback)
  group.GET("/v1/oauth/twitter", api.TwitterOauthInitiate)
  group.GET("/v1/oauth/twitter/callback", api.TwitterOauthCallback)

  group.GET("/v1/feeds/categories", api.GetAllCategories)
  group.GET("/v1/feeds/news", api.GetNews)
}

// ConfHandler handle the app config, for example
func (api *API) ConfHandler(c echo.Context) error {
	app := c.Get("app").(*App)
	// <-time.After(time.Millisecond * 500)
	c.JSON(200, app.Conf.Root)
	return nil
}

func (api *API) RegisterUser(c echo.Context) error {
  // t := c.Query("type")
  user := &User{}
  err := c.Bind(user)
  if err != nil {
    Must(err)
    c.Error(err)
  }
  u, err := RegisterUser(user)
  if err != nil {
    c.Error(err)
    return nil
  }
  c.JSON(200, u)
  return nil
}

func (api *API) ActivateUser(c echo.Context) error {
  u := &User{}
  c.JSON(200, u)
  return nil
}


func (api *AuthRoutes) Bind(group *echo.Group) {
  group.USE(api.AuthMiddleware)
  group.GET("/v1/firstauth", api.GetFirst)
}

func (api *AuthRoutes) GetFirst(c echo.Context) error {
  u := c.Get("user")
  c.JSON(200, u)
  return nil
}