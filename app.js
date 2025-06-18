console.log("🔍 Fuera del DOMContentLoaded:", document.getElementById("album"));
import { stickerLibrary } from './stickerLibrary.js';
import { auth, provider, db } from "./firebase-init.js";
import { signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let album;
let currentUser = null;
let userData = {};
let currentSticker = null;

document.addEventListener("DOMContentLoaded", () => {
  console.log("⚙️ DOMContentLoaded triggered");

  album = document.getElementById("album");
  console.log("🎯 album:", album);

  if (!album) {
    console.error("💥 NO ENCONTRÉ EL ELEMENTO #album. DOM incompleto o script ejecutado antes de tiempo.");
    return;
  }


  album = document.getElementById("album");
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const userEmailSpan = document.getElementById("userEmail");

const stickerModal = document.getElementById("stickerModal");
const stickerImage = document.getElementById("stickerImage");
const stickerTitle = document.getElementById("stickerTitle");
const stickerDescription = document.getElementById("stickerDescription");
const stickerNote = document.getElementById("stickerNote");
const claimStickerBtn = document.getElementById("claimStickerBtn");
const modalClose = document.querySelector(".close");

onAuthStateChanged(auth, async user => {
  console.log("Auth state changed:", user);

  if (user) {
    const allowedDomains = ["umag.cl", "umagallanes.cl"];
const adminException = "hermanelgueta@gmail.com";
const userEmail = user.email || "";
const domain = userEmail.split("@")[1];

if (
  userEmail !== adminException &&
  !allowedDomains.includes(domain)
) {
  alert("Solo se permiten correos de dominio umag.cl o umagallanes.cl.");
  signOut(auth);
  return;
}

    console.log("Usuario autenticado");

    currentUser = { uid: user.uid, email: user.email };

    userEmailSpan.textContent = `Conectado como ${user.email}`;
    userEmailSpan.classList.remove("hidden");
    logoutBtn.classList.remove("hidden");
    loginBtn.classList.add("hidden");

    document.getElementById("tabs").hidden = false;
    document.getElementById("stickerDetails").classList.add("hidden");
    album.innerHTML = "";

    // Borra posibles unidades anteriores antes de renderizar
    for (let u = 1; u <= 3; u++) {
      const unit = document.getElementById(`unit${u}`);
      if (unit) unit.remove();
    }

userData = await loadUserData(user.uid);
    console.log("userData loaded", userData);

    init();
    renderAlbum();
    album.hidden = false;

  } else {
    console.log("Usuario NO autenticado");

    currentUser = null;
    userData = {};

    userEmailSpan.textContent = "";
    userEmailSpan.classList.add("hidden");
    logoutBtn.classList.add("hidden");
    loginBtn.classList.remove("hidden");

    document.getElementById("tabs").hidden = true;
    document.getElementById("stickerDetails").classList.add("hidden");

    // Borra unidades si existen
    for (let u = 1; u <= 3; u++) {
      const unit = document.getElementById(`unit${u}`);
      if (unit) unit.remove();
    }

    album.hidden = false;
    album.innerHTML = "<p>Por favor inicia sesión para ver el álbum.</p>";
  }
});






loginBtn.addEventListener("click", () => {
  signInWithPopup(auth, provider).catch(console.error);
});
logoutBtn.addEventListener("click", () => {
  signOut(auth);
});


async function loadUserData(uid) {
  try {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return snap.data();
    } else {
      return { email: currentUser.email, stickers: {}, logs: [] };
    }
  } catch (e) {
    console.error("Error al cargar desde Firestore:", e);
    return { email: currentUser.email, stickers: {}, logs: [] };
  }
}


async function saveUserData() {
  if (!currentUser?.uid) return;
  try {
    const ref = doc(db, "users", currentUser.uid);
    await setDoc(ref, userData, { merge: true });
    // También lo guardamos localmente por si acaso
    localStorage.setItem(`user_${currentUser.uid}`, JSON.stringify(userData));
  } catch (e) {
    console.error("Error al guardar en Firestore:", e);
  }
}

function init() {
  if (!userData.logs) userData.logs = [];
  userData.logs.push({ action: "login", time: new Date().toISOString() });
  saveUserData();
}


function renderAlbum() {
  const unitTitles = {
    1: "Introducción",
    2: "Numéricas",
    3: "Relaciones"
  };

  for (let u = 1; u <= 3; u++) {
    let unit = document.getElementById(`unit${u}`);
    if (!unit) {
      unit = document.createElement("div");
      unit.id = `unit${u}`;
      unit.classList.add("page");
      album.appendChild(unit);
    } else {
      unit.innerHTML = "";
    }

    unit.innerHTML = `<h2 style="margin-bottom: 1em;">${unitTitles[u] || `Unidad ${u}`}</h2>`;

    for (let c = 1; c <= 3; c++) {
      const section = document.createElement("div");
      section.className = "class-section";

      const classTitle = document.createElement("h3");
      classTitle.textContent = `Clase ${c}`;
      section.appendChild(classTitle);

      for (let s = 1; s <= 3; s++) {
        const id = `u${u}c${c}s${s}`;
        const info = stickerLibrary[id] || {};
        const unlocked = userData.stickers?.[id]?.claimed;
        const stickerDiv = document.createElement("div");
        const stickerType = id.endsWith("s1") ? "s1" :
                            id.endsWith("s2") ? "s2" :
                            id.endsWith("s3") ? "s3" : "";
        stickerDiv.className = `sticker ${stickerType}`;
        if (!unlocked) stickerDiv.classList.add("locked");

        const img = document.createElement("img");
        img.src = info.image || `stk/${id}.png`;
        img.alt = info.name || id;
        img.onerror = () => { img.src = "stk/what.png"; };
        img.title = info.name || "Nombre no disponible";

        const label = document.createElement("div");
        label.className = "label";
        label.textContent = info.name || id;

        stickerDiv.appendChild(img);
        stickerDiv.appendChild(label);

        if (userData.stickers?.[id]?.certified) {
          const badge = document.createElement("span");
          badge.className = "certified-badge";
          badge.textContent = "✅";
          stickerDiv.appendChild(badge);
        }

        stickerDiv.addEventListener("click", () => openSticker(id));
        section.appendChild(stickerDiv);
      }

      unit.appendChild(section);
    }
  }
    // Asegúrate que al menos una unidad esté activa al renderizar
  const firstTab = document.querySelector('.tab[data-unit="1"]');
  const firstPage = document.getElementById('unit1');
  if (firstTab && firstPage &&
      !document.querySelector('.page.active')) {
    firstTab.classList.add('active');
    firstPage.classList.add('active');
  }

  album.hidden = false;
}



function openSticker(id) {
  currentSticker = id;
  const info = stickerLibrary[id] || {};
  const data = userData.stickers?.[id] || {};
  const type = id.endsWith("s1") ? "s1" : id.endsWith("s2") ? "s2" : "s3";

  // Limpia selección previa
  document.querySelectorAll('.sticker').forEach(st => st.classList.remove('selected'));

  // Marca este como seleccionado
  const current = document.querySelector(`.sticker img[alt="${info.name || id}"]`)?.parentElement;
  if (current) current.classList.add("selected");

  const claimed = data.claimed;
  const container = document.getElementById("stickerDetails");
  container.classList.remove("hidden");

  let html = `<h2>${info.name || id}</h2>`;

  if (!claimed && info.unlockable) {
html += `
  <p><strong>Requisito:</strong> ${info.requirement || "Requisito no disponible."}</p>
  <textarea id="stickerInput" placeholder="Tu reflexión aquí...">${data.message || ""}</textarea>
  <br>
  <button id="claimBtn">Reclamar sticker</button>
  <button id="cancelBtn">Cancelar</button>
`;
  } else if (!claimed && !info.unlockable) {
    html += `<p><em>Este sticker no puede ser desbloqueado aún.</em></p>`;
  } else {
    const certified = data.certified;
    html += `
      <img src="${info.image || 'stk/' + id + '.png'}" style="width: 120px; display:block; margin: 10px 0;">
      <h3>${certified ? "✅ Certificado por el profesor" : ""}</h3>
      <p><strong>Descripción:</strong> ${info.description_fun || "No disponible"}</p>
      <p><strong>Contenido técnico:</strong> ${info.description_tech || "No disponible"}</p>
      <p><strong>Referencias:</strong><br>${
        info.links?.length
          ? info.links.map(l => `<a href="${l.url}" target="_blank">${l.label}</a>`).join("<br>")
          : "No disponibles"
      }</p>
      <p><strong>Mensaje del estudiante:</strong> "${data.message || "(sin mensaje)"}"</p>
      <p><strong>Fecha:</strong> ${data.timestamp ? new Date(data.timestamp).toLocaleString() : "(sin fecha)"}</p>
<button id="unclaimBtn">Deshacer desbloqueo</button>
    `;
    document.getElementById("unclaimBtn")?.addEventListener("click", () => unclaimSticker(id));
  }

  container.innerHTML = html;
  document.getElementById("claimBtn")?.addEventListener("click", () => claimSticker(id));
document.getElementById("cancelBtn")?.addEventListener("click", cancelSticker);
document.getElementById("unclaimBtn")?.addEventListener("click", () => unclaimSticker(id));

}


modalClose.addEventListener("click", () => {
  stickerModal.classList.add("hidden");
  currentSticker = null;
});

claimStickerBtn.addEventListener("click", () => {
  const msg = stickerNote.value.trim();
  const id = currentSticker;
  const info = stickerLibrary[id];
  const now = new Date().toISOString();
  const certified = msg.toLowerCase().includes("certificar");

  if (!info?.unlockable) return;
  if (!msg) return alert("Escribe algo para reclamar este sticker.");

  if (!userData.logs) userData.logs = [];
  userData.logs.push({ action: "claimed " + id, message: msg, time: now });

  userData.stickers[id] = {
    claimed: true,
    certified,
    message: msg,
    timestamp: now
  };

  saveUserData();
  stickerModal.classList.add("hidden");
  renderAlbum();
});

document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById("stickerDetails").classList.add("hidden");
currentSticker = null;
document.querySelectorAll('.sticker').forEach(st => st.classList.remove('selected'));
  if (!userData.logs) userData.logs = [];
  userData.logs.push({ action: `switch to unit${tab.dataset.unit}`, time: new Date().toISOString() });
  saveUserData();

    tab.classList.add("active");
    document.getElementById("unit" + tab.dataset.unit).classList.add("active");
  });
});






function claimSticker(id) {
  const msg = document.getElementById("stickerInput").value.trim();
  if (!msg) return alert("Escribe tu reflexión para reclamar.");

  const now = new Date().toISOString();
  const certified = msg.toLowerCase().includes("certificar");

  if (!userData.logs) userData.logs = [];
  userData.logs.push({ action: `claimed ${id}`, message: msg, time: now });

  userData.stickers[id] = {
    claimed: true,
    certified,
    message: msg,
    timestamp: now
  };

  saveUserData();
  renderAlbum();
  openSticker(id);
}


function unclaimSticker(id) {
  if (!userData.logs) userData.logs = [];
  userData.logs.push({ action: `unclaimed ${id}`, time: new Date().toISOString() });

  delete userData.stickers[id];
  saveUserData();
  renderAlbum();
  document.getElementById("stickerDetails").classList.add("hidden");
  currentSticker = null;
}



function cancelSticker() {
  currentSticker = null;
  document.getElementById("stickerDetails").classList.add("hidden");
  document.querySelectorAll('.sticker').forEach(st => st.classList.remove('selected'));
}
});
