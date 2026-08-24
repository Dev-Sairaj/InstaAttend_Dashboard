# Insta Attend Admin - HR Management Dashboard

A modern HR management dashboard with features for tracking employees, attendance, payroll, and leave management.

## Project info

## Color Palette

### Primary Colors
- Primary Purple: `#9b87f5` (hsl: 255 82% 67%)
- Dark Purple: `#6035cc`
- Light Purple: `#e5deff`

### Insta Attend Brand Colors
```css
--instattend-50: #f3f1fe
--instattend-100: #e9e4fe
--instattend-200: #d8cffe
--instattend-300: #bbadfb
--instattend-400: #9b87f5
--instattend-500: #8262ef
--instattend-600: #7246e1
--instattend-700: #6035cc
--instattend-800: #502ea7
--instattend-900: #422886
--instattend-950: #281855
```

### UI Colors
- Background: `#f9fafb` (Light gray background)
- Card Background: `#ffffff` (White)
- Border Color: `#e5e7eb` (Light gray border)
- Text Primary: `#111827` (Dark gray)
- Text Secondary: `#6b7280` (Medium gray)
- Success: `#10b981` (Green)
- Warning: `#f59e0b` (Yellow)
- Error: `#ef4444` (Red)
- Info: `#3b82f6` (Blue)

### Theme Colors
```css
--background: 0 0% 100%
--foreground: 222.2 84% 4.9%
--card: 0 0% 100%
--card-foreground: 222.2 84% 4.9%
--popover: 0 0% 100%
--popover-foreground: 222.2 84% 4.9%
--primary: 255 82% 67%
--primary-foreground: 210 40% 98%
--secondary: 210 40% 96.1%
--secondary-foreground: 222.2 47.4% 11.2%
--muted: 210 40% 96.1%
--muted-foreground: 215.4 16.3% 46.9%
--accent: 210 40% 96.1%
--accent-foreground: 222.2 47.4% 11.2%
--destructive: 0 84.2% 60.2%
--destructive-foreground: 210 40% 98%
--border: 214.3 31.8% 91.4%
--input: 214.3 31.8% 91.4%
--ring: 255 82% 67%
```

### Status Colors
- Approved: Green (`bg-green-100 text-green-800 border-green-200`)
- Pending: Yellow (`bg-yellow-100 text-yellow-800 border-yellow-200`) 
- Rejected: Red (`bg-red-100 text-red-800 border-red-200`)

## Fonts

The application uses the default Tailwind CSS font stack:

### Primary Font
- **Sans-serif stack:** ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"

### Font Sizes
- Heading 1: `text-2xl` (24px)
- Heading 2: `text-xl` (20px)
- Body: `text-base` (16px)
- Small: `text-sm` (14px)
- Extra Small: `text-xs` (12px)

## API Documentation

This section outlines the required APIs for the Insta Attend HR Management Dashboard. Backend developers should implement these endpoints to ensure the frontend functions correctly.

### Base URL
The API base URL should be configurable through the environment variable `VITE_API_URL`. Default: `http://localhost:3000/api`

### Authentication API

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|-------------|----------|
| `/auth/login` | POST | Authenticate user | `{ email, password }` | `{ token, user: { id, name, email, role } }` |
| `/auth/register` | POST | Register new user | `{ name, email, password, role }` | `{ token, user: { id, name, email, role } }` |
| `/auth/forgot-password` | POST | Request password reset | `{ email }` | `{ message }` |
| `/auth/reset-password` | POST | Reset password | `{ token, password }` | `{ message }` |

### Employee API

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|-------------|----------|
| `/employees` | GET | Get all employees | - | `[{ id, name, email, phone, position, department, joinDate, status, avatar }]` |
| `/employees/:id` | GET | Get employee by ID | - | `{ id, name, email, phone, position, department, joinDate, status, avatar }` |
| `/employees` | POST | Create employee | Employee data without ID | Created employee with ID |
| `/employees/:id` | PUT | Update employee | Updated fields | Updated employee |
| `/employees/:id` | DELETE | Delete employee | - | - |

### Attendance API

| Endpoint | Method | Description | Request Body/Params | Response |
|----------|--------|-------------|-------------|----------|
| `/attendance` | GET | Get all attendance records | Query params: `startDate`, `endDate` | `[{ id, employeeId, employeeName, date, checkIn, checkOut, status, workingHours }]` |
| `/attendance/employee/:id` | GET | Get attendance by employee | Query params: `startDate`, `endDate` | `[{ id, employeeId, employeeName, date, checkIn, checkOut, status, workingHours }]` |
| `/attendance/check-in` | POST | Record check-in | `{ employeeId, latitude?, longitude? }` | Attendance record |
| `/attendance/check-out` | POST | Record check-out | `{ employeeId, latitude?, longitude? }` | Updated attendance record |
| `/attendance/reports` | GET | Get attendance reports | Query params: `startDate`, `endDate` | Attendance statistics and reports |

### Leave Management API

| Endpoint | Method | Description | Request Body/Params | Response |
|----------|--------|-------------|-------------|----------|
| `/leave` | GET | Get all leave requests | Query params: `status`, `startDate`, `endDate` | `[{ id, employeeId, employeeName, type, startDate, endDate, days, status, reason, appliedOn }]` |
| `/leave/:id` | GET | Get leave request by ID | - | Leave request details |
| `/leave` | POST | Create leave request | `{ employeeId, type, startDate, endDate, reason }` | Created leave request |
| `/leave/:id` | PUT | Update leave request | Updated fields | Updated leave request |
| `/leave/:id/approve` | POST | Approve leave request | `{ approvedBy }` | Updated leave request |
| `/leave/:id/reject` | POST | Reject leave request | `{ rejectedBy, rejectedReason }` | Updated leave request |
| `/leave/employee/:id` | GET | Get leaves by employee | Query params: `status` | Leave requests for employee |

### Payroll API

| Endpoint | Method | Description | Request Body/Params | Response |
|----------|--------|-------------|-------------|----------|
| `/payroll` | GET | Get all payrolls | Query params: `month`, `year`, `status` | `[{ id, employeeId, employeeName, month, year, baseSalary, bonuses, deductions, netSalary, paymentStatus, paymentDate }]` |
| `/payroll/generate` | POST | Generate payroll | `{ month, year }` | Generated payroll records |
| `/payroll/:id` | GET | Get payroll by ID | - | Payroll details |
| `/payroll/employee/:id` | GET | Get payrolls by employee | Query params: `year` | Payroll records for employee |
| `/payroll/:id/download` | GET | Download payslip | - | PDF file |


##ID PASSWORD FOR ADMIN PANEL
### EMAIL: admin@insta-attend.com
### PASSWORD: password123