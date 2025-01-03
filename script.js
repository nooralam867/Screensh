let prompt = document.querySelector("#prompt");
let submitbtn = document.querySelector("#submit");
let chatContainer = document.querySelector(".chat-container");
let imagebtn = document.querySelector("#image");
let image = document.querySelector("#image img");

let user = {
    message: null,
    file: {
        mime_type: null,
        data: null
    }
};

// Capture full screen screenshot
async function captureFullScreen() {
    try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const track = stream.getVideoTracks()[0];
        const imageCapture = new ImageCapture(track);

        const bitmap = await imageCapture.grabFrame();

        const canvas = document.createElement("canvas");
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

        track.stop();
        return canvas.toDataURL("image/png").split(",")[1];
    } catch (error) {
        console.error("Error capturing screen:", error.message || error);
        alert("Screen capture failed. Please grant permission or select a screen to share.");
        return null;
    }
}

async function handleChatResponse(userMessage) {
    user.message = userMessage;

    const base64string = await captureFullScreen();
    if (base64string) {
        user.file = {
            mime_type: "image/png",
            data: base64string
        };
        image.src = `data:image/png;base64,${user.file.data}`;
        image.classList.add("choose");
    }

    let html = `<img src="user.png" alt="" id="userImage" width="8%">
<div class="user-chat-area">
${user.message}
${user.file.data ? `<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg" />` : ""}
</div>`;
    prompt.value = "";
    let userChatBox = document.createElement("div");
    userChatBox.innerHTML = html;
    userChatBox.classList.add("user-chat-box");
    chatContainer.appendChild(userChatBox);
}

submitbtn.addEventListener("click", () => {
    handleChatResponse(prompt.value);
});
