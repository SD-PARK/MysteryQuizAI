const inputText = document.getElementById('input-text');
const sendButton = document.getElementById('send-button');
const progress = document.getElementById('progress-step');
const chatContainer = $('#chat-container');
/** 
 * 메시지 전송 가능 여부를 나타내는 변수
 * 이 변수는 메시지를 전송한 후 답변이 도착하기 전까지 전송을 금지하기 위해 사용됩니다.
*/
let sendPossible = true;
/**
 * 게임 생성 시 사용된 초기 토큰 값입니다.
 * 게임의 진행 단계 연산을 위해 사용됩니다.
 */
let initialTokenValue = 0;

/** 메시지 전송 시: Enter or Send Button Click */
$('#send-button').click(() => { if(checkMessage()) { inquiry(); } });
$('#input-text').keydown((e) => {
    if (e.keyCode === 13 && !e.shiftKey && sendPossible && checkMessage()) {
        inquiry();
        e.preventDefault();
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

/**
 * 게임 생성에 사용한 토큰 개수에 따라, Progress Bar의 max, value를 초기화합니다.
 * @param {number} tokens - 게임 생성에 사용한 토큰의 개수입니다.
 */
function initProgressBar(tokens) {
    progress.value = 0;
    progress.max = 4097 - tokens;
    initialTokenValue = tokens;
}
/**
 * 토큰 개수에 따라, Progress Bar의 진행 단계를 갱신합니다.
 * @param {number} tokens - 현재 토큰의 개수입니다.
 */
function updateProgressBar(tokens) {
    const half = progress.max * 0.5;
    const fewLeft = progress.max * 0.85;
    if (half > progress.value && half <= (tokens - initialTokenValue)) {
        modalFade(true);
    } else if (fewLeft > progress.value && fewLeft <= (tokens - initialTokenValue)) {
        modalFade(false);
    }
    progress.value = tokens - initialTokenValue;
}

/**
 * Textarea 안의 Text를 지우고, 버튼을 비활성화합니다.
 */
function emptyTextarea() {
    $('#input-text').val('');
    buttonDisabled();
}


/**
 * 제한 시간이 일정 수치를 넘었을 때, 팝업 창을 출력합니다.
 * @param {boolean} halftime - 제한 시간이 절반 지났다면 True, 아니라면 False.
 */
function modalFade(halftime) {
    chatContainer.append(`<div id="modal"></div>`);
    const modal = $('#modal');

    if (halftime) { modal.html(`제한 시간이 절반 남았습니다!`); }
    else { modal.html(`제한 시간이 얼마 남지 않았습니다!<br>현재까지 모인 단서를 통해 범인을 지목하고, 그 이유를 설명하세요!`); }

    modal.animate({ "opacity": '0.9' }, 300, 'swing');
    setTimeout(() => {
        modal.animate({ "opacity": '0' }, 300, 'swing');
    }, 4500);
    setTimeout(() => {
        modal.remove();
    }, 5000);
}