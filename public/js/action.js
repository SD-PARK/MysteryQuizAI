const inputText = document.getElementById('input-text');
const sendButton = document.getElementById('send-button');
/** 
 * 메시지 전송 가능 여부를 나타내는 변수
 * 이 변수는 메시지를 전송한 후 답변이 도착하기 전까지 전송을 금지하기 위해 사용됩니다.
*/
let sendPossible = true;

/** 메시지 전송 시: Enter or Send Button Click */
$('#send-button').click(function() { inquiry(); });
$('#input-text').keydown(function(event) {
    if (event.keyCode === 13 && !event.shiftKey && sendPossible) {
        inquiry();
        event.preventDefault();
    }
});

/** Textarea에 Text가 입력되어있고, sendPossible 변수가 True일 때 Send Button을 활성화합니다. */
inputText.addEventListener('input', checkSendPossible);
function checkSendPossible() {
    if (inputText.value.trim() !== '' && sendPossible) { buttonEnabled(); }
    else { buttonDisabled(); }
}

/** Send Button을 활성화합니다. */
function buttonEnabled() {
    sendButton.classList.add("active");
    sendButton.disabled = false;
}

/** Send Button을 비활성화합니다. */
function buttonDisabled() {
    sendButton.classList.remove("active");
    sendButton.disabled = true;
}

/**
 * Textarea의 text가 변경될 때마다, Textarea와 채팅 로그의 높이를 자동으로 조정합니다.
 * @param {textarea} textarea
 */
function autoResize(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = (textarea.scrollHeight) + "px";
    chatLogs.css('margin-bottom', (textarea.scrollHeight + 40) + "px");
}