let files = [];
let outputDir = "";

const dropZone = document.getElementById("dropZone");

// Drag & drop support
dropZone.addEventListener("dragover", e => e.preventDefault());

dropZone.addEventListener("drop", e => {
  e.preventDefault();
  files = [...e.dataTransfer.files].map(f => f.path);
  document.getElementById("info").innerText = files.length + " files selected via drag & drop";
});

// Select files manually
async function pickFiles() {
  files = await window.api.selectFiles();
  if (files) document.getElementById("info").innerText = files.length + " files selected";
}

// Select output folder
async function pickFolder() {
  outputDir = await window.api.selectFolder();
  if (outputDir) document.getElementById("info").innerText = "Output folder: " + outputDir;
}

// Start conversion
async function convert() {
  if (!files.length || !outputDir) {
    alert("Please select files and output folder first!");
    return;
  }

  await window.api.convertBatch({ files, outputDir });
}

// Update progress bar
window.api.onProgress((event, data) => {
  const percent = (data.completed / data.total) * 100;
  document.getElementById("progress").style.width = percent + "%";
});
