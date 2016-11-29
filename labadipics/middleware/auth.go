package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"bitbucket.org/fanky5g/labadipost/labadipics/config"
	"bitbucket.org/fanky5g/labadipost/labadipics/signature"
)

// Security wraps the request and confront sent parameters with secret key
func Security() gin.HandlerFunc {
	return func(c *gin.Context) {
		cfg := config.FromContext(c)

		secretKey := cfg.SecretKey

		if secretKey != "" {
			if !signature.VerifyParameters(secretKey, c.MustGet("parameters").(map[string]string)) {
				c.String(http.StatusUnauthorized, "Invalid signature")
				c.Abort()
				return
			}
		}

		c.Next()
	}
}
