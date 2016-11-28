package main

import (
  "bytes"
  "html/template"
  "net/smtp"
  "os"
)

var auth smtp.Auth

//Request struct
type Request struct {
  from    string
  to      []string
  subject string
  body    string
}

func init() {
  auth = smtp.PlainAuth("", os.Getenv("GMAIL_USER"), os.Getenv("GMAIL_PASS"), "smtp.gmail.com")
}

func NewMailRequest(to []string, subject, body string) *Request {
  return &Request{
    to:      to,
    subject: subject,
    body:    body,
  }
}

func (r *Request) SendEmail() (bool, error) {
  mime := "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\n\n"
  subject := "Subject: " + r.subject + "!\n"
  msg := []byte(subject + mime + "\n" + r.body)
  addr := "smtp.gmail.com:587"

  if err := smtp.SendMail(addr, auth, "fanky5g@gmail.com", r.to, msg); err != nil {
    return false, err
  }
  return true, nil
}

func (r *Request) ParseTemplate(templateFileName string, data interface{}) error {
  t, err := template.ParseFiles(templateFileName)
  if err != nil {
    return err
  }
  buf := new(bytes.Buffer)
  if err = t.Execute(buf, data); err != nil {
    return err
  }
  r.body = buf.String()
  return nil
}