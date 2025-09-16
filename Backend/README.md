# Biz-Boost 

# Description
Biz Boost is a smart business platform designed to empower Nigeria’s micro and small retailers (SMEs) with digital tools for growth, customer engagement, and data-driven decision-making. Biz-Boost combines frontend, backend, analytics, and cybersecurity to provide SMEs with a secure, user-friendly business dashboard.

🎯 Features
- User Authentication: Secure sign-up and sign-in with password hashing.
- Password Management: Functionality for password reset via OTP (One-Time Password) sent to a user's email.
- Form Submission Handling: Collects and stores data from user-submitted forms.
- API Integration: Provides a set of RESTful endpoints for seamless connection with a frontend application.

## Installation & Usage
```bash
# Clone the repository
- git clone https://github.com/WelldoneEsu/biz-boost.git

# Navigate into the folder
- cd biz-boost

# Install dependencies
- npm install

# Start development server
- npm run dev

## Technologies Used
Technologies
- Node.js: The runtime environment for the server.
- Express.js: A minimalist web framework for building the API.
- MongoDB: A NoSQL database for flexible data storage.
- Mongoose: An elegant MongoDB object modeling tool.
- bcryptjs: Used for hashing passwords to ensure security.
- jsonwebtoken (JWT): Generates tokens for secure user sessions.
- Nodemailer: Handles sending emails for password reset OTPs.

## Author
- Welldone Esu

## Getting Started
1. Clone the repository: git clone https://github.com/your-name/bizboost.git
2. Install dependencies: npm install
3. Start the application: npm start

## Set up environment variables:
- PORT=5000
- MONGO_URI=<Your MongoDB connection string>
- JWT_SECRET=<A long, random string>
- EMAIL_USER=<Your email address for sending OTPs>
- EMAIL_PASS=<Your email password or App Password>

API Endpoints
The API is structured around the /api/auth base URL. All requests should be made to these endpoints.

## Authentication
#POST /api/auth/signup
- Description: Registers a new user.
- Body (JSON): { "firstName", "lastName", "email", "password", "businessName", "phoneNumber" }

#POST /api/auth/signin
- Description: Authenticates a user and returns a JWT token.
- Body (JSON): { "email", "password" }
- POST /api/auth/requestPasswordReset
- Description: Sends a password reset OTP to the user's email.
- Body (JSON): { "email" }

## POST /api/auth/resetPassword
- Description: Verifies the OTP and updates the user's password.
- Body (JSON): { "email", "otp", "newPassword" }
- POST /api/auth/logout
- Description: Clears the user's session token.

Database Schema
The core data model is the User schema, which stores all necessary user information.

User SchemA
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  businessName: { type: String, required: true },
  phoneNumber: { type: String, required: true, minlength: 11, maxlength: 15 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  otp: { type: String, select: false },
  otpExpires: Date,
}, { timestamps: true });
This schema is used to save and manage user data in the MongoDB database.

## Authentication & Security
- Password Hashing: User passwords are not stored in plain text. They are hashed using bcryptjs before being saved to the database.
- JWT Tokens: After successful authentication, a JSON Web Token (JWT) is issued to the client. This token is used to authenticate subsequent requests to protected routes.
- Password Reset: A secure OTP is generated and sent to the user's email, with a 10-minute expiration to prevent misuse. The OTP is also hashed before being stored in the database

📦 Project Deliverables
✅ UI/UX wireframes, prototypes & usability testing
✅ Responsive frontend with accessibility features
✅ Secure backend APIs with authentication & data handling
✅ Business analytics dashboard
✅ Cybersecurity protocol with vulnerability testing

👨‍💻 Team Members (Team 6 – Vephla University Capstone)
- Project Manager: Chinemelu Ikenna
- Data Analysts: Ayomiposi Cecilia, Isioma Cynthia, Joseph Ibidapo, Sanyaolu Olubukola, Tawfiq Tawfiqot, Oyewole Dare, Uwanaka Immelda
- UI/UX Designers: Babatunde Olawale, Fatima Salako, Nyarko Daniel
- Frontend Developers: Akinnagbe Henry, Jesse Joel
- Backend Developer: Esu Welldone David
- Cybersecurity Engineer: Chinedum Udenkwo

## Security
- Helmet for HTTP headers
- Rate limiting (300 req / 15 min / IP)
- XSS clean + Mongo sanitize
- CORS enabled
- Request validation via express-validator

## Usage
- npm start

## First commit and push
- ```bash
- git add .
- git commit -m "Initial project setup with folder structure"
- git branch -M main
- git remote add origin https://github.com/welldoneesu/biz-boost.git
- git push -u origin main

#Licence
- MIT Licence


