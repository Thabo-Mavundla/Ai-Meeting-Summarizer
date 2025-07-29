// static/script.js
document.addEventListener("DOMContentLoaded", () => {

  // File input handling
  const fileInput = document.getElementById('fileInput');
  const uploadLabel = document.querySelector('.upload-label');

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      uploadLabel.textContent = fileInput.files[0].name;
    } else {
      uploadLabel.textContent = 'Choose File';
    }
  });

  // Language input with suggestions
  const languageInputs = document.querySelectorAll('input[name="targetLanguage"]');
  const supportedLanguages = [
    'English', 'Spanish', 'French', 'German', 'Zulu',
    'Afrikaans', 'Chinese', 'Japanese', 'Arabic', 'Hindi'
  ];

  languageInputs.forEach(input => {
    const suggestionsContainer = input.nextElementSibling;
    
    input.addEventListener('input', (e) => {
      const value = e.target.value.toLowerCase();
      suggestionsContainer.innerHTML = '';
      
      if (value.length > 1) {
        const matches = supportedLanguages.filter(lang => 
          lang.toLowerCase().includes(value)
        );
        
        if (matches.length) {
          matches.forEach(lang => {
            const suggestion = document.createElement('div');
            suggestion.textContent = lang;
            suggestion.addEventListener('click', () => {
              input.value = lang;
              suggestionsContainer.style.display = 'none';
            });
            suggestionsContainer.appendChild(suggestion);
          });
          suggestionsContainer.style.display = 'block';
        } else {
          suggestionsContainer.style.display = 'none';
        }
      } else {
        suggestionsContainer.style.display = 'none';
      }
    });
    
    input.addEventListener('blur', () => {
      setTimeout(() => {
        suggestionsContainer.style.display = 'none';
      }, 200);
    });
    
    input.addEventListener('focus', () => {
      if (input.value.length > 1) {
        suggestionsContainer.style.display = 'block';
      }
    });
  });

  // Audio recording functionality
  let mediaRecorder;
  let audioChunks = [];
  let recordedBlob;

  const startBtn = document.getElementById('startRecording');
  const stopBtn = document.getElementById('stopRecording');
  const uploadBtn = document.getElementById('uploadRecording');
  const playback = document.getElementById('recordingPlayback');
  
  startBtn.addEventListener('click', async () => {
    try {
      
      startBtn.classList.add('recording-active');
      startBtn.innerHTML = '<span class="btn-text">Recording</span> <span class="loading-dots"><span>.</span><span>.</span><span>.</span></span>';
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];

      mediaRecorder.ondataavailable = e => {
        if (e.data.size > 0) audioChunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        startBtn.classList.remove('recording-active');
        startBtn.innerHTML = '<span class="btn-text">Start Recording</span>';
        recordedBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const audioURL = URL.createObjectURL(recordedBlob);
        playback.src = audioURL;
        playback.style.display = 'block';
        uploadBtn.disabled = false;
      };

      mediaRecorder.start();
      startBtn.disabled = true;
      stopBtn.disabled = false;
    } catch (error) {
      startBtn.classList.remove('recording-active');
      startBtn.innerHTML = '<span class="btn-text">Start Recording</span>';
      alert(`Error accessing microphone: ${error.message}`);
    }
  });

  stopBtn.addEventListener('click', () => {
    mediaRecorder.stop();
    startBtn.classList.remove('recording-active');
    startBtn.innerHTML = '<span class="btn-text">Start Recording</span>';
    stopBtn.disabled = true;
    startBtn.disabled = false;
  });

  uploadBtn.addEventListener('click', () => {
    const title = document.getElementById('recordingTitle').value || 'untitled';
    const language = document.querySelector('#recordUploadForm input[name="targetLanguage"]').value;
    
    if (!language) {
      alert('Please enter a target language');
      return;
    }

    const formData = new FormData();
    formData.append('audioFile', recordedBlob, `${title}.webm`);
    formData.append('targetLanguage', language);

    uploadBtn.disabled = true;
    uploadBtn.textContent = 'Uploading...';

    fetch('/process', {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert(`Error: ${data.error}`);
      } else {
        displayResults(data);
        loadHistory();
      }
    })
    .catch(error => {
      alert(`Upload failed: ${error.message}`);
    })
    .finally(() => {
      uploadBtn.disabled = false;
      uploadBtn.textContent = 'Upload Recording';
    });
  });

  // Drag and drop functionality
  const uploadZone = document.getElementById('uploadZone');
  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
  });

  uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('dragover');
  });

  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    if (e.dataTransfer.files.length) {
      fileInput.files = e.dataTransfer.files;
      uploadLabel.textContent = fileInput.files[0].name;
    }
  });

document.addEventListener('click', async function(e) {
    if (e.target.classList.contains('delete-btn') || 
        e.target.parentElement.classList.contains('delete-btn')) {
        
        e.preventDefault();
        e.stopPropagation();
        
        const deleteBtn = e.target.classList.contains('delete-btn') ? 
                         e.target : e.target.parentElement;
        
        const card = deleteBtn.closest('.history-card');
        const filename = deleteBtn.dataset.filename;
        const timestamp = deleteBtn.dataset.timestamp;

        if (confirm('Are you sure you want to delete this entry?')) {
            try {
                const response = await fetch('/delete-history', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        filename: filename,
                        timestamp: timestamp
                    })
                });

                const result = await response.json();
                
                if (result.error) {
                    alert('Error: ' + result.error);
                } else {
                    // Add fade out animation before removing
                    card.style.transition = 'opacity 0.3s ease';
                    card.style.opacity = '0';
                    
                    // Wait for animation to complete before removing
                    setTimeout(() => {
                        card.remove();
                        
                        // If no cards left, show empty state
                        const historyGrid = document.querySelector('.history-grid');
                        if (historyGrid && historyGrid.children.length === 0) {
                            historyGrid.innerHTML = `
                                <div class="card empty-state">
                                    <h3>No meeting history yet</h3>
                                    <p>Your processed meetings will appear here</p>
                                </div>
                            `;
                        }
                    }, 300);
                }
            } catch (error) {
                alert('Failed to delete: ' + error.message);
            }
        }
    }
});

// Add this at the top of your script.js (inside DOMContentLoaded)
if (document.querySelector('.history-container')) {
    // This code will only run on the history page
    document.addEventListener('click', async function(e) {
        // Check if the click is on a delete button or its icon
        const deleteBtn = e.target.closest('.delete-btn');
        if (deleteBtn) {
            e.preventDefault();
            e.stopPropagation();
            
            const card = deleteBtn.closest('.history-card');
            const filename = deleteBtn.dataset.filename;
            const timestamp = deleteBtn.dataset.timestamp;

            // Use your custom modal or the browser's confirm dialog
            if (confirm('Are you sure you want to delete this entry?')) {
                try {
                    const response = await fetch('/delete-history', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            filename: filename,
                            timestamp: timestamp
                        })
                    });

                    const result = await response.json();
                    
                    if (result.error) {
                        alert('Error: ' + result.error);
                    } else {
                        // Add fade out animation
                        card.style.transition = 'opacity 0.3s ease';
                        card.style.opacity = '0';
                        
                        // Wait for animation to complete before removing
                        setTimeout(() => {
                            card.remove();
                            
                            // Check if we need to show the empty state
                            const historyGrid = document.querySelector('.history-grid');
                            if (historyGrid && historyGrid.children.length === 0) {
                                historyGrid.innerHTML = `
                                    <div class="card empty-state">
                                        <h3>No meeting history yet</h3>
                                        <p>Your processed meetings will appear here</p>
                                    </div>
                                `;
                            }
                        }, 300);
                    }
                } catch (error) {
                    alert('Failed to delete: ' + error.message);
                }
            }
        }
    });
}
});

// Global functions
function displayResults(data) {
  document.getElementById("transcriptionText").innerText = data.transcription || "No transcription available.";
  document.getElementById("summaryText").innerText = data.summary || "No summary available.";
  document.getElementById("keyPoints").innerHTML = data.bullets && data.bullets.length > 0 ?
    data.bullets.map(b => `<li>${b}</li>`).join('') :
    "<li>No key points available.</li>";
  document.getElementById("translatedText").innerText = data.translation || "No translation available.";

  const audioDownload = document.getElementById("audioDownload");
  if (data.audio_url) {
    audioDownload.href = data.audio_url;
    audioDownload.style.display = "inline-block";
    audioDownload.download = data.filename || "audio_output.mp3";
  } else {
    audioDownload.style.display = "none";
  }
}

function loadHistory() {
  fetch("/get-history")
    .then((res) => res.json())
    .then((history) => {
      const list = document.getElementById("historyList");
      list.innerHTML = "";
      if (history.length === 0) {
        list.innerHTML = "<li>No history yet</li>";
        return;
      }
      history.forEach((item) => {
        const li = document.createElement("li");
        const date = new Date(item.timestamp);
        li.textContent = `${date.toLocaleString()} - ${item.filename}`;

        const delBtn = document.createElement("button");
        delBtn.textContent = "🗑️";
        delBtn.title = "Delete this entry";
        delBtn.className = "delete-btn";

        delBtn.onclick = (e) => {
          e.stopPropagation();
          if (confirm("Delete this history entry?")) {
            fetch("/delete-history", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ filename: item.filename, timestamp: item.timestamp }),
            })
            .then(res => res.json())
            .then(data => {
              if (data.error) alert("Error: " + data.error);
              else loadHistory();
            })
            .catch(() => alert("Failed to delete entry"));
          }
        };

        li.appendChild(delBtn);
        li.onclick = () => displayHistoryItem(item);
        list.appendChild(li);
      });
    });
}

function downloadText() {
  const transcription = document.getElementById("transcriptionText").innerText;
  const summary = document.getElementById("summaryText").innerText;
  const bullets = Array.from(document.getElementById("keyPoints").children)
    .map(li => li.textContent).join("\n- ");
  const translation = document.getElementById("translatedText").innerText;

  const content = `=== Transcription ===\n${transcription}\n\n` +
                  `=== Summary ===\n${summary}\n\n` +
                  `=== Key Points ===\n- ${bullets}\n\n` +
                  `=== Translation ===\n${translation}`;

  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `meeting-summary-${new Date().toISOString().slice(0,10)}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function displayHistoryItem(item) {
  document.getElementById("transcriptionText").innerText = item.transcription || "No transcription available.";
  document.getElementById("summaryText").innerText = item.summary || "No summary available.";
  document.getElementById("keyPoints").innerHTML = item.bullets && item.bullets.length > 0 ?
    item.bullets.map(b => `<li>${b}</li>`).join('') :
    "<li>No key points available.</li>";
  document.getElementById("translatedText").innerText = item.translation || "No translation available.";

  const audioDownload = document.getElementById("audioDownload");
  if (item.audio_url) {
    audioDownload.href = item.audio_url;
    audioDownload.style.display = "inline-block";
    audioDownload.download = item.filename || "audio_output.mp3";
  } else {
    audioDownload.style.display = "none";
  }
}