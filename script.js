const GITHUB_USERNAME = "your-username";
const REPO_NAME = "your-repo";
const BRANCH = "main";
const FOLDER = "files";
const TOKEN = "ghp_xxx..."; // 👈 Store securely (not recommended to expose in JS!)

async function uploadFile() {
  const fileInput = document.getElementById("fileInput");
  if (!fileInput.files.length) return;

  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = async function () {
    const base64 = reader.result.split(',')[1];
    const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${FOLDER}/${file.name}`;

    const response = await fetch(url, {
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

    if (response.ok) {
      alert("Upload successful");
      listFiles();
    } else {
      alert("Upload failed");
    }
  };
  reader.readAsDataURL(file);
}

async function listFiles() {
  const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${FOLDER}`;

  const res = await fetch(url, {
    headers: {
      "Authorization": `token ${TOKEN}`
    }
  });

  const files = await res.json();
  const list = document.getElementById("fileList");
  list.innerHTML = "";

  files.forEach(f => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="${f.download_url}" target="_blank" download>${f.name}</a>`;
    list.appendChild(li);
  });
}

if (localStorage.getItem("auth") === "true") {
  listFiles();
} else {
  window.location.href = "login.html";
}
