package com.tinderapp.chat;

public class Message {
  public String from;
  public String to;
  public String text;
  public long createdAt;


  public Message() {}

  public Message(String from, String to, String text, long createdAt) {
    this.from = from;
    this.to = to;
    this.text = text;
    this.createdAt = createdAt;
  }
}


