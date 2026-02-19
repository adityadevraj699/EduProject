EduProject/
│
├── App.jsx
│
├── src/
│   ├── navigation/
│   │     ├── AuthStack.js
│   │     ├── MainTabs.js
│   │     └── TeamStack.js
│   │
│   ├── screens/
│   │     ├── auth/
│   │     │     ├── LoginScreen.jsx
│   │     │     ├── ForgotPasswordScreen.jsx
│   │     │     ├── VerifyOtpScreen.jsx
│   │     │     └── ChangePasswordScreen.jsx
│   │     │
│   │     ├── home/
│   │     │     └── HomeScreen.jsx
│   │     │
│   │     ├── team/
│   │     │     ├── TeamListScreen.jsx
│   │     │     ├── TeamDetailsScreen.jsx
│   │     │     └── MemberScreen.jsx
│   │     │
│   │     ├── profile/
│   │     │     ├── ProfileScreen.jsx
│   │     │     ├── EditProfileScreen.jsx
│   │     │     └── SettingsScreen.jsx
│   │
│   ├── components/
│   │     ├── CustomButton.jsx
│   │     ├── InputField.jsx
│   │
│   ├── services/
│   │     └── api.js
│   │
│   ├── context/
│   │     └── AuthContext.js
│
└── assets/
eas build -p android --profile preview



CREATE TABLE password_otps (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255),
  otp_hash VARCHAR(255),
  expires_at BIGINT
);
