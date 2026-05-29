## ADDED Requirements

### Requirement: Email OTP request
The system SHALL allow a user to initiate passwordless login by submitting an email address, which triggers Supabase to send a 6-digit OTP to that address. If the email does not correspond to an existing account, an account SHALL be created automatically.

#### Scenario: OTP sent for existing account
- **WHEN** a registered email address is submitted on the login page
- **THEN** Supabase sends a 6-digit OTP to that address and the UI transitions to the OTP entry step

#### Scenario: OTP sent for new email (auto-register)
- **WHEN** an unregistered email address is submitted on the login page
- **THEN** Supabase creates a new user account and sends a 6-digit OTP to that address

#### Scenario: Invalid email format
- **WHEN** a malformed email address is submitted
- **THEN** the form displays a validation error and no OTP request is made

### Requirement: OTP verification
The system SHALL allow a user to verify their identity by entering the 6-digit OTP received via email, resulting in an authenticated session being established.

#### Scenario: Successful OTP verification
- **WHEN** the correct OTP is entered within its validity window
- **THEN** a session cookie is written, the user is authenticated, and they are redirected to `/dashboard`

#### Scenario: Incorrect OTP
- **WHEN** an incorrect OTP is entered
- **THEN** no session is established and an error message is displayed

#### Scenario: Expired OTP
- **WHEN** a valid OTP is entered after its expiry time has passed
- **THEN** no session is established and the user is informed the code has expired

### Requirement: Login page route protection
The system SHALL redirect users away from the login page if they are already authenticated.

#### Scenario: Authenticated user visits login page
- **WHEN** a user with a valid session navigates to `/`
- **THEN** they are redirected to `/dashboard`

### Requirement: Dashboard route protection
The system SHALL prevent unauthenticated access to the `/dashboard` route.

#### Scenario: Unauthenticated user visits dashboard
- **WHEN** a user without a valid session navigates to `/dashboard`
- **THEN** they are redirected to `/`
