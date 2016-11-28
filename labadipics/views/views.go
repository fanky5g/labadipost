package views

import (
  "net/http"
  "bytes"

  "github.com/gin-gonic/gin"
  "github.com/mholt/binding"
  "bitbucket.com/fanky5g/labadipost/labadipics/application"
  "bitbucket.com/fanky5g/labadipost/labadipics/engine"
  "bitbucket.com/fanky5g/labadipost/labadipics/errs"
  "bitbucket.com/fanky5g/labadipost/labadipics/payload"
  "bitbucket.com/fanky5g/labadipost/labadipics/storage"
  "github.com/disintegration/imaging"
)

// DisplayView displays and image using resizing parameters
func DisplayView(c *gin.Context) {
  file, err := application.ImageFileFromContext(c, true, true)

  if err != nil {
    errs.Handle(err, c.Writer)

    return
  }

  for k, v := range file.Headers {
    c.Header(k, v)
  }

  c.Data(http.StatusOK, file.ContentType(), file.Content())
}

// UploadView uploads an image to the destination storage
func UploadView(c *gin.Context) {
  multipartPayload := new(payload.MultipartPayload)
  errors := binding.Bind(c.Request, multipartPayload)
  if errors.Handle(c.Writer) {
    return
  }

  file, err := multipartPayload.Upload(storage.DestinationFromContext(c))

  if err != nil {
    errs.Handle(err, c.Writer)

    return
  }

  image, err := imaging.Decode(bytes.NewReader(file.Content()))
  if err != nil {
    errs.Handle(err, c.Writer)

    return
  }
  width, height := engine.ImageSize(image)

  c.JSON(http.StatusOK, gin.H{
    "filename": file.Filename(),
    "path":     file.Path(),
    "url":      file.URL(),
    "width":    width,
    "height":   height,
  })
}

// DeleteView deletes a file from storages
func DeleteView(c *gin.Context) {
  err := application.Delete(c, c.Param("path")[1:])

  if err != nil {
    errs.Handle(err, c.Writer)

    return
  }

  c.String(http.StatusOK, "Ok")
}

// GetView generates an image synchronously and return its information from storages
func GetView(c *gin.Context) {
  file, err := application.ImageFileFromContext(c, false, false)

  if err != nil {
    errs.Handle(err, c.Writer)

    return
  }

  c.JSON(http.StatusOK, gin.H{
    "filename": file.Filename(),
    "path":     file.Path(),
    "url":      file.URL(),
  })
}

// RedirectView redirects to the image using base url from storage
func RedirectView(c *gin.Context) {
  file, err := application.ImageFileFromContext(c, false, false)

  if err != nil {
    errs.Handle(err, c.Writer)

    return
  }

  c.Redirect(http.StatusMovedPermanently, file.URL())
}