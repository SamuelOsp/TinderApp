package com.tinderapp.models;

import java.util.ArrayList;
import java.util.List;

public class Profile {
  public String uid;
  public String name;
  public String lastName;
  public String city;
  public List<String> photos = new ArrayList<>();

  public Profile() {}

  public Profile(String uid, String name, String lastName, String city, List<String> photos) {
    this.uid = uid;
    this.name = name;
    this.lastName = lastName;
    this.city = city;
    if (photos != null) this.photos = photos;
  }

  public String getUid() { return uid; }
  public String getName() { return name; }
  public String getLastName() { return lastName; }
  public String getCity() { return city; }
  public List<String> getPhotos() { return photos; }
}
