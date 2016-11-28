package server

import (
	"fmt"
	"net/http"
	"strconv"

	netContext "context"

	"github.com/getsentry/raven-go"
	"github.com/gin-gonic/contrib/cors"
	"github.com/gin-gonic/contrib/sentry"
	"github.com/gin-gonic/gin"
	"bitbucket.com/fanky5g/labadipost/labadipics/application"
	"bitbucket.com/fanky5g/labadipost/labadipics/config"
	"bitbucket.com/fanky5g/labadipost/labadipics/engine"
	"bitbucket.com/fanky5g/labadipost/labadipics/kvstore"
	"bitbucket.com/fanky5g/labadipost/labadipics/logger"
	"bitbucket.com/fanky5g/labadipost/labadipics/middleware"
	"bitbucket.com/fanky5g/labadipost/labadipics/middleware/context"
	"bitbucket.com/fanky5g/labadipost/labadipics/storage"
	"bitbucket.com/fanky5g/labadipost/labadipics/views"
	"github.com/thoas/stats"
)

// Load loads the application and launch the webserver
func Load(path string) error {
	ctx, err := application.Load(path)

	if err != nil {
		return err
	}

	return Run(ctx)
}

// Router returns a gin Engine
func Router(ctx netContext.Context) (*gin.Engine, error) {
	router := gin.Default()

	cfg := config.FromContext(ctx)

	methods := map[string]gin.HandlerFunc{
		"redirect": views.RedirectView,
		"display":  views.DisplayView,
		"get":      views.GetView,
	}

	kv := kvstore.FromContext(ctx)

	if cfg.Sentry != nil {
		client, err := raven.NewClient(cfg.Sentry.DSN, cfg.Sentry.Tags)

		if err != nil {
			return nil, err
		}

		router.Use(sentry.Recovery(client, true))
	}

	router.Use(context.SetLogger(logger.FromContext(ctx)))
	router.Use(context.SetKVStore(kv))
	router.Use(context.SetSourceStorage(storage.SourceFromContext(ctx)))
	router.Use(context.SetDestinationStorage(storage.DestinationFromContext(ctx)))
	router.Use(context.SetEngine(engine.FromContext(ctx)))
	router.Use(context.SetConfig(cfg))

	if cfg.AllowedOrigins != nil && cfg.AllowedMethods != nil {
		allowedOrigins := cfg.AllowedOrigins

		allowAllOrigins := false

		if len(allowedOrigins) == 1 {
			if allowedOrigins[0] == "*" {
				allowAllOrigins = true
			}
		}

		if allowAllOrigins {
			allowedOrigins = nil
		}

		router.Use(cors.New(cors.Config{
			AllowAllOrigins: allowAllOrigins,
			AllowedOrigins:  allowedOrigins,
			AllowedMethods:  cfg.AllowedMethods,
			AllowedHeaders:  cfg.AllowedHeaders,
		}))
	}

	s := stats.New()

	router.Use(func() gin.HandlerFunc {
		return func(c *gin.Context) {
			beginning, recorder := s.Begin(c.Writer)
			c.Next()
			s.End(beginning, recorder)
		}
	}())

	router.GET("/stats", func(c *gin.Context) {
		c.JSON(http.StatusOK, s.Data())
	})

	for name, view := range methods {
		views := []gin.HandlerFunc{
			middleware.ParametersParser(),
			middleware.KeyParser(),
			middleware.Security(),
			middleware.URLParser(),
			middleware.OperationParser(),
			view,
		}

		router.GET(fmt.Sprintf("/%s", name), views...)

		if cfg.Storage != nil && cfg.Storage.Src != nil {
			router.GET(fmt.Sprintf("/%s/*parameters", name), views...)
		}
	}

	if cfg.Options.EnableUpload {
		router.POST("/upload", views.UploadView)
	}

	if cfg.Options.EnableDelete {
		router.DELETE("/*path", views.DeleteView)
	}

	return router, nil
}

// Run loads a new server
func Run(ctx netContext.Context) error {
	engine, err := Router(ctx)

	if err != nil {
		return err
	}

	engine.Run(fmt.Sprintf(":%s", strconv.Itoa(config.FromContext(ctx).Port)))

	return nil
}
