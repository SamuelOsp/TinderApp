# TinderApp (Ionic + Angular + Capacitor 7 + Firebase)

A Tinder-style mobile application built with **Ionic (Angular)** and **Capacitor 7**.  
It uses **Firebase Authentication, Firestore, and Storage** to manage users, profiles, matches, and chat.

---

## ✨ Main Features
- **Authentication** – login & register (Ionic/Firebase Auth)
- **Update Profile** – edit user info, passions, photos (Ionic UI + Firebase Storage)
- **Matching Window** – native **Java** view with:
  - swipe gesture (like / skip)
  - **❤️ heart button** → creates a match & opens chat
  - top-bar **Chat button**
  - shows full profile info (name, age, city, passions, photos)
- **Chat View** – native **Java** view:
  - realtime Firebase Firestore messages
  - **sent messages → right**, **received messages → left**
  - chat list previews **peer’s image + last message**
- **Android Widget** – tapping the widget launches the app
- **Capacitor 7 Plugins** (Java):
  - File Picker Plugin – choose profile photos
  - Matching Plugin – native swipe deck querying Firebase profiles
  - Chat Plugin – native chat read/write to Firestore

<<<<<<< HEAD
---
=======
---
>>>>>>> 81e0e1d235447f229a80fa30f49dbe54b3a9fb28
