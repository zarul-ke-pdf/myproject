const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

// Assuming you have your HTML structure with these IDs
var btnCreate = document.getElementById('btnCreate');
var btnRead = document.getElementById('btnRead');
var btnUpdate = document.getElementById('btnUpdate');
var btnDelete = document.getElementById('btnDelete');
var feedbackName = document.getElementById('feedbackName'); // Input for feedback name
var feedbackContents = document.getElementById('feedbackContents'); // Input for feedback content
var feedbackList = document.getElementById('feedbackList'); // Reference to the list

let pathName = path.join(__dirname, "Files");

// Ensure the directory exists
if (!fs.existsSync(pathName)) {
    fs.mkdirSync(pathName, { recursive: true });
}

// Function to refresh the feedback list
function refreshFeedbackList() {
    // Clear the existing list
    feedbackList.innerHTML = '';
    
    // Read the directory to get files
    fs.readdir(pathName, (err, files) => {
        if (err) {
            console.error(err);
            return;
        }

        // Display each file
        files.forEach(file => {
            let li = document.createElement('li');
            li.textContent = file.replace('.txt', ''); // Set the text to the file name without extension
            li.addEventListener('click', () => {
                feedbackName.value = li.textContent; // Set feedback name to the clicked item
                btnRead.click(); // Automatically read the clicked feedback
            });
            feedbackList.appendChild(li); // Add to the list
        });
    });
}

// Call this function on page load to display existing feedback
refreshFeedbackList();

// Event Listener for Creating a New Feedback Entry
btnCreate.addEventListener('click', function() {
    let file = path.join(pathName, feedbackName.value.trim() + '.txt'); // Feedback name as filename
    let contents = feedbackContents.value;

    // Check if feedbackName is not empty
    if (!feedbackName.value.trim()) {
        alert('Please enter a valid feedback name.');
        return;
    }

    // Check if file already exists
    fs.access(file, fs.constants.F_OK, (err) => {
        if (!err) {
            // File exists
            alert('Feedback already exists. Please choose a different name.');
            return;
        }

        // Write to the file
        fs.writeFile(file, contents, function(err) {
            if (err) {
                console.error(err);
                alert('Error creating feedback file: ' + err.message);
                return;
            }
            alert(`Feedback for "${feedbackName.value}" was created.`);
            console.log('The feedback file was created.');

            // Clear input fields
            feedbackContents.value = '';
            feedbackName.value = '';

            // Refresh feedback list after creating a file
            refreshFeedbackList();
        });
    });
});

// Event Listener for Reading a Feedback Entry
btnRead.addEventListener('click', function() {
    let file = path.join(pathName, feedbackName.value.trim() + '.txt');

    if (!feedbackName.value.trim()) {
        alert('Please enter a valid feedback name.');
        return;
    }

    fs.readFile(file, 'utf8', function(err, data) {
        if (err) {
            console.error(err);
            alert('Error reading file: ' + err.message);
            return;
        }
        feedbackContents.value = data; // Display the contents in the text area
        console.log("The feedback file was displayed.");
        alert(`Feedback for "${feedbackName.value}" is displayed.`);
    });
});

// Event Listener for Updating a Feedback Entry
btnUpdate.addEventListener('click', function() {
    let file = path.join(pathName, feedbackName.value.trim() + '.txt'); // Get file path
    let contents = feedbackContents.value; // Get updated contents

    if (!feedbackName.value.trim()) {
        alert('Please enter a valid feedback name.');
        return;
    }

    // Check if the file exists before updating
    fs.access(file, fs.constants.F_OK, (err) => {
        if (err) {
            alert("Feedback file does not exist. Please create it first.");
            return;
        }

        // Write the updated contents to the file
        fs.writeFile(file, contents, function(err) {
            if (err) {
                console.error(err);
                alert('Error updating file: ' + err.message);
                return;
            }
            alert(`Feedback for "${feedbackName.value}" was updated.`);
            console.log('The feedback file was updated with new information.');

            // Clear input fields
            feedbackContents.value = '';
            feedbackName.value = '';

            // Refresh feedback list after updating
            refreshFeedbackList();
        });
    });
});

// Event Listener for Deleting a Feedback Entry
btnDelete.addEventListener('click', function() {
    let file = path.join(pathName, feedbackName.value.trim() + '.txt');

    if (!feedbackName.value.trim()) {
        alert('Please enter a valid feedback name.');
        return;
    }

    fs.unlink(file, function(err) {
        if (err) {
            console.error(err);
            alert('Error deleting file: ' + err.message);
            return;
        }
        feedbackName.value = '';
        feedbackContents.value = '';
        console.log('The feedback file was deleted.');
        alert(`Feedback for "${feedbackName.value}" has been deleted.`);
        refreshFeedbackList(); // Refresh the list after deleting a file
    });
});

// Call refreshFeedbackList on page load to display existing feedback files
window.onload = function() {
    refreshFeedbackList();
};
