package main

import (
  "container/list"
  "hash/fnv"
  "bytes"
)

type HashValue struct {
  key []byte
  value interface{}
}

type Hash struct {
  size uint32
  count int
  buckets []*list.List
}

func NewHash(size int) *Hash {
  h := &Hash{
    size: uint32(size),
    buckets: make([]*list.List, size),
  }
  for i := 0; i < size; i++ { h.buckets[i] = list.New() }
  return h
}

func (h *Hash) Set(key []byte, value interface{}) {
  h.buckets[h.getIndex(key)].PushBack(&HashValue{key, value})
  h.count++
  if h.count / len(h.buckets) > 5 {
    h.rehash()
  }
}

func (h *Hash) getIndex(key []byte) uint32 {
  hasher := fnv.New32a()
  hasher.Write(key)
  return hasher.Sum32() % h.size
}

func (h *Hash) Get(key []byte) interface{} {
  list := h.buckets[h.getIndex(key)]
  for element := list.Front(); element != nil; element = element.Next() {
    wrapped := element.Value.(*HashValue)
    if bytes.Equal(wrapped.key, key) {
      return wrapped.value
    }
  }
  return nil
}

func (h *Hash) rehash() {
  h.size *= 2
  newBuckets := make([]*list.List, h.size)
  for i := 0; i < int(h.size); i++ {
    newBuckets[i] = list.New()
  }

  for i := 0; i < len(h.buckets); i++ {
    for element := h.buckets[i].Front(); element != nil; element = element.Next() {
      wrapped := element.Value.(*HashValue)
      newIndex := h.getIndex(wrapped.key)
      newBuckets[newIndex].PushBack(wrapped)
    }
  }
  h.buckets = newBuckets
}