let files = [];
let outputDir = "";

async function pickFiles() {
  files = await window.api.selectFiles();
  document.getElementById("info").innerText = files.length + " files selected";
}

async function pickFolder() {
  outputDir = await window.api.selectFolder();
  document.getElementById("info").innerText = "Output: " + outputDir;
}

async function convert() {
  if (!files.length || !outputDir) {
    alert("Select files and folder");
    return;
  }

  await window.api.convertBatch({ files, outputDir });
}

window.api.onProgress((event, data) => {
  const percent = (data.completed / data.total) * 100;
  document.getElementById("bar").style.width = percent + "%";
});