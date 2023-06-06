
const inputText = document.getElementById('input-text');
const sendButton = document.getElementById('send-button');

// 메시지 전송 가능 여부를 나타내는 변수
// 이 변수는 메시지를 전송한 후 답변이 도착하기 전까지 전송을 금지하기 위해 사용됩니다.
let sendPossible = true;

inputText.addEventListener('input', checkSendPossible);

function checkSendPossible() {
    if (inputText.value.trim() !== '' && sendPossible) { buttonEnabled(); }
    else { buttonDisabled(); }
}

function buttonEnabled() {
    sendButton.classList.add("active");
    sendButton.disabled = false;
}

function buttonDisabled() {
    sendButton.classList.remove("active");
    sendButton.disabled = true;
}

function autoResize(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = (textarea.scrollHeight) + "px";
}