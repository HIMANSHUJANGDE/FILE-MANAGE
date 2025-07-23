const GITHUB_USERNAME = "your-username";
const REPO_NAME = "your-repo";
const FOLDER = "uploads";
const BRANCH = "main";
const TOKEN = "ghp_XXXX"; // 🔥 WARNING: Never expose in public! Use Vercel/server if needed.

if (localStorage.getItem("admin") !== "true") {
  window.location.href = "login.html";
}

async function uploadFile() {
  const file = document.getElementById("fileInput").files[0];
  if (!file) return alert("No file selected");

  const reader = new FileReader();
  reader.onload = async function() {
    const base64 = reader.result.split(',')[1];
    const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${FOLDER}/${file.name}`;

    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Authorization": `token ${TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: `Add ${file.name}`,
        content: base64,
        branch: BRANCH
      })
    });

    if (res.ok) {
      alert("Upload success!");
      listFiles();
    } else {
      const data = await res.json();
      alert("Upload failed: " + (data.message || "Unknown error"));
    }
  };
  reader.readAsDataURL(file);
}

async function listFiles() {
  const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${FOLDER}`;
  const res = await fetch(url, {
    headers: { "Authorization": `token ${TOKEN}` }
  });
  const files = await res.json();
  const list = document.getElementById("fileList");
  list.innerHTML = "";
  files.forEach(file => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="${file.download_url}" target="_blank" download>${file.name}</a>`;
    list.appendChild(li);
  });
}

function logout() {
  localStorage.removeItem("admin");
  window.location.href = "login.html";
}

listFiles();
