# ⚡ EV Charger Mobile App - L2

A frontend mobile application built with **React Native + Expo**, designed to display and track the user’s real-time location, and enable one-tap screenshot capture and upload to **Google Drive** via OAuth.

> ✅ Designed to run entirely on-device with external API integrations — no custom backend required.

> ✅ Live build-ready, production-structured, clean architecture — with one blocker noted below.

---

## 📱 Features

- 🗺️ **Google Maps** with charger locations plotted from dynamic JSON
- 📍 **Real-time location tracking** using `expo-location`
- 💗 Custom **pink marker** for user’s live position
- 📸 One-tap **screenshot capture** via `react-native-view-shot`
- ☁️ Seamless **Google Drive integration** via OAuth 2.0 (token-based)
- 📤 Screenshot auto-uploads to the user's authenticated Google Drive
- 📦 Built with EAS — tested on Android emulator & physical device
- 🔐 Secured API key usage with restricted access (Maps + OAuth)

---

## 🧠 Tech Stack

| Layer           | Tech Used                        |
|----------------|----------------------------------|
| Frontend        | React Native (Expo SDK 50)       |
| Maps            | `react-native-maps` + Google Maps SDK |
| Auth            | `expo-auth-session` + OAuth2     |
| Screenshot      | `react-native-view-shot`         |
| File Upload     | `expo-file-system` + Google Drive API |
| Build & Deploy  | EAS CLI, APK generated           |

---

## 🧭 Screens

| Map View with Chargers | Pink Marker (You) | Capture FAB |
|------------------------|-------------------|-------------|
| ![Map](./assets/images/Screenshot-2025-03-28-121044.png) | ![Marker](./assets/screenshots/pink-marker.png) | ![Capture](./assets/screenshots/fab.png) |

---

## 🏗️ Architecture Summary

- `index.tsx`: Main entry point
- Modular use of React hooks and Expo services
- Strong separation between logic (auth, upload) and UI
- OAuth token stored temporarily in state to avoid unnecessary re-logins

---

## 🚧 Known Issue: Google OAuth Redirect Error

Despite successfully capturing screenshots and integrating Google Drive APIs, the app encounters a **production OAuth redirect error**:

> ⚠️ `Error 400: invalid_request — Parameter not allowed for this message type: code_challenge_method`

![OAuth Error Screenshot](./assets/screenshots/oauth-error.png)

### Root Cause:
Google OAuth 2.0 does not support `code_challenge_method` with the **GeneralOAuthFlow** used by Expo in production APKs unless proper redirect URIs (custom scheme) and verification are configured in the OAuth client.

---

## 💡 Completion Summary

| Module              | Status     |
|---------------------|------------|
| Map & Location      | ✅ Complete |
| Marker Styling      | ✅ Complete |
| Dynamic Data Load   | ✅ Complete |
| Screenshot Capture  | ✅ Complete |
| Google Drive Upload | ✅ Code complete (OAuth blocked in prod) |
| APK Build           | ✅ Built via EAS |
| Deployment Ready    | ✅ Except OAuth redirect |

---

## 📦 APK Build Link

> ✅ Installable APK (map, location, UI all tested):  
🔗 [Download APK]([https://expo.dev/accounts/shivahazari/projects/EvChargerApp/builds/df340f8a-2b70-449d-ba30-747e53ac7ff2](https://drive.google.com/file/d/1j21nQO4hDKOZ2R-hqKW0gB6ZPt5WcBvu/view?usp=drive_link))

---

## 🏁 How to Run Locally

```bash
git clone https://github.com/Shiva-code-code/EV-Charger-Mobile-App-L2.git
cd EvChargerApp
npm install
npx expo start

#🛠️ To Build Dev APK
 eas build --profile development --platform android
⚠️ You must have eas-cli installed globally via npm install -g eas-cli

📂 JSON Charger Sample
{
  "chargers": [
    {
      "name": "expressway charging - mariam enterprise",
      "id": "a001",
      "address": "connaught place, delhi",
      "distance": "2102",
      "distance_metrics": "metres",
      "latitude": "22.4532122",
      "longitude": "77.4545322",
      "connector_types": ["lvl1dc-2", "lvl2dc-1", "normalac-1"]
    }
  ]
}


## 🚧 Known Issue: OAuth Login Fails in Production APK

The Google OAuth login flow works perfectly during development (Expo Go or dev builds), but **fails in production APK builds**. Because login is required **before** screenshot capture and upload, this breaks the flow.

📸 Screenshot of the issue:

![OAuth Error](./assets/screenshots/oauth-error.png)

### Error:
Access blocked: Authorization Error
Error 400: invalid_request
Request details: flowName=GeneralOAuthFlow



### ⚙️ Why it Happens

- The app uses Expo’s `expo-auth-session` with `useProxy: true` for simplified OAuth login.
- This works fine in development (Expo Go or dev build).
- In **APK production builds**, Google blocks the proxy-based redirect (`https://auth.expo.io/...`) unless:

### ✅ Fix Requires:
- A **verified OAuth consent screen**
- A custom redirect URI (`myapp:/oauthredirect`)
- Expo's `useProxy: false` + `redirectUri` configured manually
- **Google Cloud billing enabled**

Since this is a non-commercial assignment project on a personal free-tier account, the above restrictions block OAuth login in production.

---

## ✅ Completion Checklist

| Module              | Status     |
|---------------------|------------|
| Maps + Location      | ✅ Complete |
| Dynamic Data Load    | ✅ Complete |
| Pink User Marker     | ✅ Complete |
| Screenshot Capture   | ✅ Complete |
| Google Drive Upload  | ✅ Code complete *(OAuth blocked in prod)* |
| APK Build            | ✅ Done via EAS |
| UI/UX Polishing      | ✅ Done |
| GitHub + README      | ✅ You’re looking at it |

---

## 📦 APK Build Link

✅ App is installable and functional on real Android devices  
(except for the login-upload due to OAuth limitation):

🔗 **[Download the APK](https://expo.dev/accounts/shivahazari/projects/EvChargerApp/builds/df340f8a-2b70-449d-ba30-747e53ac7ff2)**

---

## 🙋 About the Developer

👋 Hi! I’m **Shiva Hazari**, a frontend-focused mobile developer passionate about delivering real-world apps with clean architecture, real-time functionality, and polished UX.

### 🔍 If you're reviewing this project:

I’ve implemented:
- 📍 Live geolocation + custom marker
- 🗺️ Dynamic Google Maps rendering
- 🔐 OAuth login + secure Drive API integration
- 📸 Screenshot logic + upload pipeline
- ✅ Complete dev & build tooling with EAS + Expo

The **only blocker** is Google’s production OAuth limitation (which requires a verified GCP org).

---

## 🤝 Let’s Talk

- **GitHub**: [Shiva-code-code](https://github.com/Shiva-code-code)  
- **Email**: hshiva7661016@gmail.com

---

## 🚀 Thank You for the Opportunity

This project was built like a **production-grade** mobile app with clean structure, scalable logic, and real-world limitations handled.

✅ I'm ready to build, debug, and deploy — at scale.

---




