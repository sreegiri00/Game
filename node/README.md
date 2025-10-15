# BookMyEvent Backend

This is the **backend server** for the BookMyEvent platform built using **Node.js**, **Express**, and **MongoDB**.  
It supports authentication, user management, OTP verification, password reset, and role-based access.

---

## 📂 Folder Structure

```
backend-bookmyevent/
│
├── config/
│   ├── db.js                 # MongoDB connection
│   ├── env.js                # Environment variables loader
│   └── mailer.js             # Nodemailer configuration
│
├── controllers/
│   ├── authController.js     # Auth: register, login, OTP, password reset
│   └── userController.js     # Users: getAll, getOne, update, delete, block/reactive
│
├── middlewares/
│   ├── authMiddleware.js     # JWT verification + role authorization
│
├── models/
│   └── User.js               # User schema with password hashing
│
├── routes/
│   ├── authRoutes.js         # Auth endpoints
│   └── userRoutes.js         # User endpoints
│
├── utils/
│   ├── generateId.js         # User ID generator
│   ├── sendEmail.js          # Email sending function
│   ├── sentEmail.js          # Email templates
│   └── tokenGenerator.js     # JWT, OTP, reset token
│
├── .env                      # Environment variables
├── package.json
└── server.js                 # Main Express app
```

---

## ⚙️ Installation

1. Clone the repo:
```bash
git clone <repo-url>
cd backend-bookmyevent
```

2. Install dependencies:
```bash
npm install
```

3. Set up `.env` file:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/bookmyevent
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-app-password
OTP_EXPIRY_MINUTES=10
```

4. Start the server:
```bash
npm run dev
```

---

## 🔑 Authentication Flow

### 1. Register

`POST /api/auth/register`
Request Body:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "123456",
  "phone": "9876543210",
  "role": "user"
}
```

* Creates user
* Sends **welcome email**
* Returns JWT token

### 2. Login

`POST /api/auth/login`
Request Body:
```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

* Verifies credentials
* Updates `lastLogin`
* Returns JWT token

### 3. Logout

`POST /api/auth/logout`

* Stateless, client discards JWT

---

### 4. OTP Verification

**Send OTP**: `POST /api/auth/otpSend`
Request Body:
```json
{ "email": "john@example.com" }
```

**Verify OTP**: `POST /api/auth/otpVerify`
Request Body:
```json
{ "email": "john@example.com", "otp": "123456" }
```

---

### 5. Forgot / Reset Password

**Forgot Password**: `POST /api/auth/forgot-password`
Request Body:
```json
{ "email": "john@example.com" }
```

* Sends email with reset link:
```
http://localhost:5000/api/auth/reset-password/<resetToken>
```

**Reset Password**: `POST /api/auth/reset-password/:token`
Request Body:
```json
{ "password": "newpassword123" }
```

* Updates password after validating token

---

## 👤 User Management (Admin Only)

**Get All Users**: `GET /api/users`
**Get Single User**: `GET /api/users/:id`
**Update User**: `PUT /api/users/:id`
**Delete User**: `DELETE /api/users/:id`
**Block / Reactivate User**: `PATCH /api/users/:id/block` or `PATCH /api/users/:id/reactive`

All routes require **JWT token** and `superadmin` or `admin` role.

---

## 🔐 Middleware

* `protect`: Verify JWT token
* `authorizeRoles('role1','role2')`: Restrict access based on user role

---

## 📧 Email Templates

* **Welcome Email**
* **OTP Email**
* **Password Reset Email**

---

## 💡 Utilities

* `generateUserId(role)` → Generates unique user ID
* `generateJwtToken(payload)` → Generates JWT
* `generateOtp()` → Generates 6-digit OTP
* `generateResetToken()` → Secure token for password reset

---

## 🚀 Starting the App

```bash
npm run dev
```

Visit `http://localhost:5000/api` for API endpoints.

---

## 📝 Notes

* Passwords are hashed automatically with bcrypt before saving.
* Reset tokens are hashed in the database for security.
* OTP is valid for 10 minutes by default.
* JWT expires in `7 days` (configurable via `.env`).

---