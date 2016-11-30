package main

import (
  "github.com/dgrijalva/jwt-go"
  "gopkg.in/mgo.v2/bson"
  "gopkg.in/mgo.v2"
  "github.com/mrjones/oauth"
  "golang.org/x/oauth2"
  "os"
  "time"
  "errors"
  "fmt"
  "github.com/labstack/echo"
  "github.com/labstack/echo/engine/standard"
  "strings"
  "strconv"
)

var mySigningKey = []byte(os.Getenv("JWT_KEY"))
type Claims struct {
  Username  string `json:"username"`
  Email string `json:"email"`
  Firstname  string `json:"firstname"`
  Lastname string `json:"lastname"`
  Avatar string   `json:"avatar"`
  Id  bson.ObjectId  `json:"id"`
  jwt.StandardClaims
}

type Details struct {
  Username string  `json:"username"`
  Password string `json:"password"`
}

type AuthUser struct {
  User *User `json:"user"`
  Token string `json:"token"`
}

type AccessToken struct {
  Provider string   `json:"provider"`
  Id string `json:"id"`
  TwitterToken *oauth.AccessToken `json:"twittertoken"`
  FbToken *oauth2.Token  `json:"fbtoken"`
  GoogleToken *oauth2.Token  `json:"googletoken"`
}

func (token *AccessToken) Get() interface{} {
  isGoogle := token.Provider == "google"
  isFb := token.Provider == "facebook"
  // isTwitter := token.Provider == "twitter"

  if isGoogle {
    return token.GoogleToken
  } else if isFb {
    return token.FbToken
  } else {
    return token.TwitterToken
  }
}

func (user *User) GenerateJWTToken(issuer string) (string, error) {
  expireToken := time.Now().Add(time.Hour * 24).Unix()

  /* Set token claims */
  claims := Claims {
    Username: user.Username,
    Email: user.Email,
    Firstname: user.Firstname,
    Lastname: user.Lastname,
    Avatar: user.Avatar,
    Id: user.Id,
    StandardClaims: jwt.StandardClaims {
        ExpiresAt: expireToken,
        Issuer:    issuer,
    },
  }

  token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

  /* Return a signed token with our secret */
  return token.SignedString(mySigningKey)
}

func (api *API) Login(c echo.Context) error {
  conn, err := ConnectMongo()
  defer conn.Close()
  if err != nil {
    c.Error(err)
    return err
  }
  
  details := &Details{}
  err = c.Bind(details)

  if err != nil {
    c.Error(err)
    return err
  }
  
  // expireCookie := time.Now().Add(time.Hour * 24)
  // cookie := http.Cookie{Name: "Auth", Value: signedToken, Expires: expireCookie, HttpOnly: true}
  admin, err := strconv.ParseBool(c.QueryParam("admin"))

  if admin {
    return LoginAdmin(c, conn, details)
  } else {
    return LoginUser(c, conn, details)
  }
}

func LoginUser(c echo.Context, conn *mgo.Session, details *Details) error {
  user := &User{}
  collection := conn.DB("labadipost").C("Users")
  err := collection.Find(bson.M{ "$or": []bson.M{ bson.M{"email": details.Username}, bson.M{"username": details.Username}}}).One(&user)
  
  if err != nil {

    if err.Error() == "not found" {
      c.Error(errors.New("user not found"))
      return err
    }

    c.Error(err)
    return err
  }

  userpass, _ := VerifyPass(user.Password, details.Password)

  if !userpass {
    return errors.New("incorrect password")
  }

  token, err := user.GenerateJWTToken("http://labadipost.com")
  if err != nil {
    c.Error(err)
    return nil
  }

  auth := &AuthUser{
    User: user,
    Token: token,
  }

  c.JSON(200, auth)
  return nil
}

func LoginAdmin(c echo.Context, conn *mgo.Session, details *Details) error {
  admin := Admin{}
  collection := conn.DB("labadipost").C("Admins")
  err := collection.Find(bson.M{ "$or": []bson.M{ bson.M{"user.email": details.Username}, bson.M{"user.username": details.Username}}}).One(&admin)
  
  if err != nil {

    if err.Error() == "not found" {
      c.Error(errors.New("admin not found"))
      return err
    }

    c.Error(err)
    return err
  }

  adminpass, _ := VerifyPass(admin.Password, details.Password)

  if !adminpass {
    return errors.New("incorrect password")
  }

  token, err := admin.User.GenerateJWTToken("http://labadipost.com")
  if err != nil {
    c.Error(err)
    return nil
  }

  auth := &AuthUser{
    User: &admin.User,
    Token: token,
  }

  c.JSON(200, auth)
  return nil
}

func (api *AuthRoutes) AuthMiddleware(protectedPage echo.HandlerFunc) echo.HandlerFunc {
  return func(c echo.Context) error {
    AuthHeader := c.Request().Header().Get("Authorization")

    if len(AuthHeader) == 0 {
      errorMsg := struct {
        Message string `json:"message"`
      }{
        Message: "unauthorized to access resource",
      }
      c.JSON(400, errorMsg)
    }

    //feels like hackery to get token..find a better way
    token := strings.TrimSpace(strings.Split(string(AuthHeader[:]), "Bearer")[1])
    claims, err := DecryptToken(token)

    if err != nil {
      errorMsg := struct {
        Message string `json:"message"`
      }{
        Message: "unauthorized to access resource",
      }
      c.JSON(401, errorMsg)
      return nil
    }

    c.Set("user", *claims)
    return protectedPage(c)
  }
}

func (api *API) Logout(c echo.Context) error {
  store, err := GetRedisStore()
  defer store.Close()

  session, err := store.Get(c.Request().(*standard.Request).Request, "jwt-storage")
  if err != nil {
    c.Error(err)
    return nil
  }

  session.Options.MaxAge = -1
  if err = session.Save(c.Request().(*standard.Request).Request, c.Response().(*standard.Response).ResponseWriter); err != nil {
    c.Error(fmt.Errorf("Logout failure"))
    return nil
  }

  message := struct{
    Success bool `json:"success"`
  }{
    Success: true,
  }
  c.JSON(200, message)
  return nil
}

func (user *User) GetOauthUser(provider string) (*User, error) {
  conn, err := ConnectMongo()
  defer conn.Close()

  if err != nil {
    return nil, err
  }

  var providerKey string
  var id string

  if isFacebook := provider == "facebook"; isFacebook {
    providerKey = "fbid"
    id = user.FbId
  } else if isTwitter := provider == "twitter"; isTwitter {
    providerKey = "twitterid"
    id = user.TwitterId
  } else if isGoogle := provider == "google"; isGoogle {
    providerKey = "gid"
    id = user.GId
  }

  userCollection := conn.DB("labadipost").C("Users")
  var oauthUser *User
  err = userCollection.Find(bson.M{fmt.Sprintf("%s", providerKey): id}).One(&oauthUser)

  if err != nil {
    return nil, err
  }
  return oauthUser, nil
}