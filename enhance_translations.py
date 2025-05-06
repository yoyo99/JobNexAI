#!/usr/bin/env python3
import json
import os
import glob
import shutil

# Définition des chemins
LOCALES_DIR = "public/locales"
BACKUP_DIR = f"{LOCALES_DIR}/backup"

# Liste des langues à traiter
LANGUAGES = ["en", "fr", "de", "es", "it"]

# Structure enrichie pour chaque langue
enhanced_translations = {
        # Navigation section (enrichie)
        "navigation": {
            "dashboard": "Dashboard",
            "jobSearch": "Job Search",
            "applications": "Applications",
            "cvBuilder": "CV Builder",
            "network": "Network",
            "profile": "Profile",
            "settings": "Settings",
            "marketAnalysis": "Market Analysis",
            "notifications": "Notifications",
            "messages": "Messages",
            "help": "Help & Support",
            "premium": "Premium Features",
            "logout": "Log Out",
            "backToHome": "Back to Home",
            "mobileMenu": "Menu",
            "closeMenu": "Close"
        },
        
        # Auth section (enrichie)
        "auth": {
            "login": "Login",
            "signup": "Sign Up",
            "logout": "Logout",
            "forgotPassword": "Forgot Password?",
            "resetPassword": "Reset Password",
            "email": "Email",
            "password": "Password",
            "confirmPassword": "Confirm Password",
            "rememberMe": "Remember Me",
            "or": "Or",
            "continueWith": "Continue with",
            "google": "Google",
            "linkedin": "LinkedIn",
            "createAccount": "Create Account",
            "alreadyHaveAccount": "Already have an account?",
            "dontHaveAccount": "Don't have an account?",
            "passwordRequirements": "Password must be at least 8 characters",
            "emailVerification": "Email Verification",
            "checkYourEmail": "Check your email to verify your account",
            "resendEmail": "Resend verification email",
            "verificationSent": "Verification email has been sent",
            "passwordChanged": "Your password has been changed successfully",
            "accountCreated": "Account created successfully! Please check your email."
        },
        
        # Dashboard section (nouvelle)
        "dashboard": {
            "welcome": "Welcome back",
            "jobsApplied": "Jobs applied",
            "interviews": "Interviews",
            "savedJobs": "Saved jobs",
            "recentActivity": "Recent activity",
            "upcomingInterviews": "Upcoming interviews",
            "jobRecommendations": "Job recommendations",
            "applicationStatus": "Application status",
            "pending": "Pending",
            "inReview": "In review",
            "interviewed": "Interviewed",
            "offered": "Offered",
            "rejected": "Rejected",
            "applicationStats": "Application statistics",
            "viewAll": "View all",
            "todayTasks": "Today's tasks",
            "completeProfile": "Complete your profile",
            "updateCV": "Update your CV",
            "checkNewJobs": "Check new job offers",
            "prepareInterview": "Prepare for interview"
        },
        
        # Search section (nouvelle)
        "search": {
            "searchJobs": "Search jobs",
            "keywords": "Keywords",
            "location": "Location",
            "category": "Category",
            "jobType": "Job type",
            "salary": "Salary",
            "experience": "Experience",
            "filters": "Filters",
            "sortBy": "Sort by",
            "relevance": "Relevance",
            "datePosted": "Date posted",
            "salary": "Salary",
            "remote": "Remote",
            "onSite": "On-site",
            "hybrid": "Hybrid",
            "fullTime": "Full-time",
            "partTime": "Part-time",
            "contract": "Contract",
            "temporary": "Temporary",
            "internship": "Internship",
            "entrylevel": "Entry level",
            "midLevel": "Mid level",
            "seniorLevel": "Senior level",
            "executive": "Executive",
            "searchResults": "Search results",
            "noResults": "No results found",
            "tryDifferentKeywords": "Try different keywords or filters"
        },
        
        # Forms section (nouvelle)
        "forms": {
            "required": "Required",
            "optional": "Optional",
            "submit": "Submit",
            "cancel": "Cancel",
            "error": "Error",
            "success": "Success",
            "loading": "Loading",
            "firstName": "First name",
            "lastName": "Last name",
            "email": "Email address",
            "phone": "Phone number",
            "address": "Address",
            "city": "City",
            "state": "State/Province",
            "zipCode": "Zip/Postal code",
            "country": "Country",
            "dateOfBirth": "Date of birth",
            "education": "Education",
            "university": "University",
            "degree": "Degree",
            "major": "Major",
            "graduationDate": "Graduation date",
            "workExperience": "Work experience",
            "company": "Company",
            "position": "Position",
            "startDate": "Start date",
            "endDate": "End date",
            "current": "Current",
            "description": "Description",
            "skills": "Skills",
            "languages": "Languages",
            "upload": "Upload",
            "dragAndDrop": "Drag and drop or click to upload",
            "fileTypes": "Supported file types",
            "maxFileSize": "Maximum file size"
        },
        
        # Common section (enrichie)
        "common": {
            "save": "Save",
            "cancel": "Cancel",
            "search": "Search",
            "view": "View",
            "edit": "Edit",
            "delete": "Delete",
            "add": "Add",
            "remove": "Remove",
            "back": "Back",
            "next": "Next",
            "previous": "Previous",
            "yes": "Yes",
            "no": "No",
            "confirm": "Confirm",
            "close": "Close",
            "apply": "Apply",
            "download": "Download",
            "upload": "Upload",
            "share": "Share",
            "loading": "Loading...",
            "success": "Success",
            "error": "Error",
            "warning": "Warning",
            "info": "Information",
            "readMore": "Read more",
            "showMore": "Show more",
            "showLess": "Show less",
            "allResults": "All results",
            "filterResults": "Filter results",
            "sortBy": "Sort by",
            "dateFormat": "MM/DD/YYYY",
            "today": "Today",
            "yesterday": "Yesterday",
            "lastWeek": "Last week",
            "lastMonth": "Last month"
        }
    },
