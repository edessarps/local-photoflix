async function openFolder() {
  if (!window.showDirectoryPicker) {
    alert("Ton navigateur ne supporte pas File System Access API (essaye Chrome ou Edge).");
    return;
  }

  const dirHandle = await window.showDirectoryPicker();
  document.getElementById("albums").innerHTML = "";
  
  for await (const [name, handle] of dirHandle.entries()) {
    if (handle.kind === "directory") {
      // Cherche la 1ère image pour l’aperçu
      let coverUrl = null;
      for await (const [fname, fhandle] of handle.entries()) {
        if (fhandle.kind === "file" && /\.(jpg|jpeg|png|gif)$/i.test(fname)) {
          const file = await fhandle.getFile();
          coverUrl = URL.createObjectURL(file);
          break;
        }
      }

      const div = document.createElement("div");
      div.className = "album";
      div.innerHTML = `
        <h3>${name}</h3>
        ${coverUrl ? `<img src="${coverUrl}" alt="${name}">` : "<p>(Pas d’image)</p>"}
      `;
      document.getElementById("albums").appendChild(div);
    }
  }
}

document.getElementById("chooseDir").addEventListener("click", openFolder);
