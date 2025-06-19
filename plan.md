# Medical Office Form Processor - Project Plan

## Project Overview
A single-page web application for processing patient flow in medical offices, specifically designed for eye doctor practices. The system handles patient information input, generates printable forms, processes scanned documents with AI, and exports data to JSON.

## Core Architecture
- **Frontend Only**: HTML, CSS, JavaScript
- **AI Integration**: Google Gemini 2.0 Flash API for handwriting recognition
- **Storage**: Browser local storage and make sure that when I close the browser and then reopen it, the data is still there. 
- **File Handling**: Browser File API for uploads and downloads

## User Workflow
```
[Select/Navigate Patient] → Patient Info Input → Generate Printable Form → 
[Doctor fills out manually outside of the program] → Upload Scanned Image → 
AI Extraction → Review/Edit Interface → Save JSON → [Navigate to Next Patient]
```

## Patient Management Workflow
```
Page Load → Auto-load All Patients → Display Last Active Patient → 
Navigate Between Patients (Previous/Next/Select from List) ↔ 
Create New Patient → Enter Information → Save to Local Storage → 
Delete Individual Patient Records → Export Patient Data
```

## Application Initialization
- **Startup Sequence**: Load all patient records from local storage on page load
- **Last Patient Tracking**: Store and retrieve the last active patient ID/index
- **Auto-Display**: Automatically populate form fields with last active patient data
- **Empty State**: Handle cases where no patients exist (show empty form for new patient)
- **Navigation State**: Initialize Previous/Next buttons based on current patient position

## Technical Specifications

### 1. User Interface Design
- **Layout**: Single scrolling page application
- **Auto-Load**: Application automatically loads and displays last active patient on startup
- **Patient Management Header**: Navigation controls at top for patient selection and navigation
- **Print Flow**: Print button → Preview page → Confirm to print
- **Modern Design**: Clean, professional medical interface
- **Responsive**: Optimized for desktop and iPhone use

### 2. Patient Information Fields
- Last name
- First name
- Sex
- Date of birth
- Patient ID
- Date and time of current appointment
- Reason for current visit
- Date of last visit
- Any overdue charges

Figure out the best way so that the user can input all this information in the easiest way and robust to avoid careless error

### 3. Medical Services List (Eye Doctor)
Predefined list of 6 services:
- UV coating on glasses
- Eye exam
- Contact lens fitting
- Retinal screening
- Glaucoma testing
- Frame selection/adjustment

### 4. Printable Form Features
- **Design**: Modern, clean layout (not traditional medical forms)
- **Service Selection**: List format for doctors to circle items
- **Layout**: Single page document optimized for printing
- **Professional**: Clear typography and organized sections

### 5. AI Processing (Gemini 2.0 Flash)
- **Input**: Scanned image of completed form 
- **Recognition**: Handwritten notes and circled selections
- **Output**: Structured text data
- **Error Handling**: User review and correction interface

### 6. Data Management
- **Storage**: Browser local storage for multiple patient records
- **Auto-Load**: Automatically load all stored patient data when webpage opens
- **Last Patient Memory**: Remember and display the last patient worked on when opening the application
- **Patient Navigation**: Next/Previous buttons to navigate between stored patients
- **Patient Selection**: Dropdown or list to quickly select any stored patient
- **Individual Deletion**: Delete specific patient records without affecting others
- **Export**: JSON files with patient name + date filename pattern
- **API Key**: User-entered Google API key saved in browser for the first time and then store the key in a local variable 
- **Clear Data**: Option button to clear all stored patient information, not the API key. A separate option button to clear the API key. 

### 7. Core Features

#### Input Section
- Form fields for all patient information
- Google API key input (saved in browser)
- Patient navigation controls (Previous/Next buttons)
- Patient selection dropdown for quick access to any stored patient
- New patient button to create fresh record
- Delete current patient button
- Clear all stored data button

#### Print Generation
- Convert input data to printable format
- Print preview functionality
- Print confirmation

#### Image Upload
- File upload interface for scanned forms 
- Image preview before processing

#### AI Extraction
- Call Gemini API with uploaded image
- Extract both selections and handwritten notes
- Present results for user review

#### Review Interface
- Display extracted information
- Allow user to modify/correct any errors
- Confirm accuracy before saving

#### Patient Management
- Store multiple patient records in browser local storage
- Auto-load all patient data on application startup
- Remember and restore last active patient when opening application
- Navigation controls to move between patients (Previous/Next)
- Patient selection dropdown showing all stored patients
- Create new patient record functionality
- Delete individual patient records with confirmation
- Patient counter display (e.g., "Patient 3 of 15")
- Track current patient index for seamless navigation

#### Export
- Generate JSON file with all patient data
- Filename format: `PatientName_YYYY-MM-DD.json`
- Download to user's computer

## Development Requirements
- No backend infrastructure needed
- No data validation or error handling required
- No HIPAA compliance considerations
- Single computer/local use only
- Modern browser compatibility

## File Structure
```
index.html          # Main application
styles.css          # Styling and print styles  
script.js           # Core functionality
README.md           # Setup instructions
```

## API Integration
- **Service**: Google Gemini 2.0 Flash
- **Authentication**: API key from user
- **Usage**: Vision capabilities for form recognition
- **Cost**: Minimal due to efficient model

## Next Steps
1. Create basic HTML structure
2. Implement local storage initialization and auto-load functionality
3. Implement patient management system (navigation, storage, deletion)
4. Add last active patient tracking and restoration
5. Implement patient information form
6. Add print functionality with CSS
7. Integrate Gemini API for image processing
8. Build review and edit interface
9. Add JSON export functionality
10. Implement local storage management for multiple patients
11. Style with modern, clean design
12. Test complete workflow including patient navigation and auto-load
13. Create user documentation 