document.addEventListener("DOMContentLoaded", function () {

  const form      = document.getElementById("form");
  const dropzone  = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");
  const dzIdle    = document.getElementById("dzIdle");
  const dzFile    = document.getElementById("dzFile");
  const dzName    = document.getElementById("dzName");
  const dzSize    = document.getElementById("dzSize");
  const dzEmoji   = document.getElementById("dzEmoji");
  const dzClear   = document.getElementById("dzClear");
  const btnSubmit = document.getElementById("btnSubmit");
  const overlay   = document.getElementById("overlay");
  const overlayMsg= document.getElementById("overlayMsg");

  if (!form) return;

  const MSGS = [
    "Sending to Groq AI…",
    "Reading document structure…",
    "Extracting fields and values…",
    "Building your Excel file…",
    "Almost there…",
  ];

  const EXT_EMOJI = { pdf: "📋", jpg: "🖼️", jpeg: "🖼️", png: "🖼️" };

  function formatBytes(b) {
    if (b < 1024)       return b + " B";
    if (b < 1048576)    return (b / 1024).toFixed(1) + " KB";
    return (b / 1048576).toFixed(2) + " MB";
  }

  function showFile(file) {
    const ext = file.name.split(".").pop().toLowerCase();
    const allowed = ["pdf", "jpg", "jpeg", "png"];
    if (!allowed.includes(ext)) {
      alert("Only PDF, JPG, JPEG, PNG files are allowed.");
      return resetFile();
    }
   if (file.size > 100 * 1024 * 1024) { alert("File size must be under 100 MB."); return resetFile(); }
    dzEmoji.textContent  = EXT_EMOJI[ext] || "📄";
    dzName.textContent   = file.name;
    dzSize.textContent   = formatBytes(file.size);
    dzIdle.style.display = "none";
    dzFile.style.display = "flex";
    btnSubmit.disabled   = false;
  }

  function resetFile() {
    fileInput.value      = "";
    dzIdle.style.display = "";
    dzFile.style.display = "none";
    btnSubmit.disabled   = true;
  }

  fileInput.addEventListener("change", () => {
    if (fileInput.files[0]) showFile(fileInput.files[0]);
  });

  dzClear && dzClear.addEventListener("click", (e) => {
    e.stopPropagation();
    resetFile();
  });

  // Drag & drop
  dropzone.addEventListener("dragover",  (e) => { e.preventDefault(); dropzone.classList.add("over"); });
  dropzone.addEventListener("dragleave", (e) => { if (!dropzone.contains(e.relatedTarget)) dropzone.classList.remove("over"); });
  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("over");
    const f = e.dataTransfer?.files[0];
    if (f) {
      try { const dt = new DataTransfer(); dt.items.add(f); fileInput.files = dt.files; } catch(_) {}
      showFile(f);
    }
  });

  // Submit → show overlay + cycle messages
  form.addEventListener("submit", () => {
    if (!fileInput.files?.length) return;
    if (overlay) {
      overlay.style.display = "flex";
      let i = 0;
      setInterval(() => {
        i = (i + 1) % MSGS.length;
        if (overlayMsg) overlayMsg.textContent = MSGS[i];
      }, 3000);
    }
    btnSubmit.disabled = true;
  });

  // Auto-dismiss alerts
  document.querySelectorAll(".alert").forEach(el => {
    setTimeout(() => {
      el.style.transition = "opacity 0.5s, transform 0.5s";
      el.style.opacity = "0";
      el.style.transform = "translateY(-6px)";
      setTimeout(() => el.remove(), 500);
    }, 5000);
  });

  // Back button: restore state
  window.addEventListener("pageshow", () => {
    if (overlay) overlay.style.display = "none";
    if (btnSubmit) btnSubmit.disabled = !(fileInput.files?.length);
  });

});
