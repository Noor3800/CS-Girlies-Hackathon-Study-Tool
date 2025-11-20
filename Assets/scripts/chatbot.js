$(document).ready(function () {
    $(".back-btn").on("click", function () {
        window.location.href = "../../Assets/pages/main.html";
    });
});

const API_BASE = "http://127.0.0.1:8000";
document.getElementById("buildBtn").onclick = async () => {
    let files = document.getElementById("fileInput").files;
    let urlInput = document.getElementById("urlInput").value;

    let formData = new FormData();
    for (let file of files) formData.append("files", file);
    formData.append("url", urlInput);

    try {
        const res = await fetch(`${API_BASE}/build-index`, {
            method: "POST",
            body: formData
        });

        let data = await res.json();
        showPopup(data.message || "Index built successfully!");
    } catch (err) {
        showPopup("Error building index!", true);
    }
};


document.getElementById("sendBtn").onclick = async () => {
    const message = document.getElementById("userMessage").value.trim();
    if (!message) return;

    addMessage(message, "user");
    document.getElementById("userMessage").value = "";

    // loading bubble
    let loading = addLoadingBubble();

    try {
        const res = await fetch(`${API_BASE}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: message })
        });

        let data = await res.json();
        loading.remove();

        const answer =
            typeof data.answer === "string"
                ? data.answer
                : JSON.stringify(data.answer?.content || "");

        addMessage(answer, "bot");

    } catch (err) {
        loading.remove();
        addMessage("⚠️ Server error!", "bot");
    }
};


document.getElementById("userMessage").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        document.getElementById("sendBtn").click();
    }
});


/* ADD MESSAGE BUBBLES*/
   
function addMessage(text, sender) {
    const chatBox = document.getElementById("chatBox");

    const bubble = document.createElement("div");
    bubble.classList.add("bubble", sender); /* matches your CSS */
    bubble.innerText = text;

    chatBox.appendChild(bubble);
    chatBox.scrollTop = chatBox.scrollHeight;
}


function addLoadingBubble() {
    const chatBox = document.getElementById("chatBox");

    const bubble = document.createElement("div");
    bubble.classList.add("bubble", "bot", "loading");
    bubble.innerHTML = `
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
    `;

    chatBox.appendChild(bubble);
    chatBox.scrollTop = chatBox.scrollHeight;

    return bubble;
}


function showPopup(message, isError = false) {
    const popup = document.createElement("div");
    popup.className = "popup";
    popup.style.background = isError ? "#ffb3b3" : "#fff4c2";
    popup.innerText = message;

    document.body.appendChild(popup);

    setTimeout(() => popup.remove(), 2500);
}
