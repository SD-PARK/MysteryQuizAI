const chatMessages = $('#chat-messages');
let messages = [];

/**
 * messages 배열에 메세지 객체를 추가합니다.
 * @param {string} role - 역할(only ['system' | 'user' | 'assistant'])
 * @param {string} content - 메시지
 */
function pushMessages(role, content) {
    messages.push({
        role: role,
        content: content
    });
}

const guide = `당신은 미해결 사건을 조사하는 탐정입니다.<br><span class="bold">정해진 시간 내</span>에 사건에 대한 단서를 수집하고, 결론을 도출해내어야 합니다.<br>주어진 명령어와 기지를 발휘해 최소한의 질문으로 게임을 클리어해보세요!<br><br>`
const commandGuide = `<br><br>당신은 사건의 조사를 위해 <span class="bold">용의자</span>들을 <span class="bold">당신 앞에</span> 데려왔습니다.<br><span class="bold">적절한 질문</span>을 통해 사건의 단서를 획득하세요.<br><br>게임 명령어:<br>1. INV - 범죄 현장을 조사합니다.<br>2. EVIDENCE - 획득한 증거 목록을 나열합니다.<br>3. NEWGAME - 새로운 게임을 시작합니다.`;
/** 새로운 게임을 요청합니다. */
function newGame() {
    sendPossible = false;
    emptyTextarea();
    chatLogs.empty();
    messages = [];
    chatMessages.html(`<div class="loader"></div><div class="notice">퀴즈를 생성 중 입니다. 최대 1분 가량 소요됩니다.</div>`);

    $.ajax({
        type: 'GET',
        url: '/openai',
        contentType: 'application/json',
        success: function(response) {
            chatMessages.html(guide + response.content + commandGuide);
            sendPossible = true;
            checkSendPossible();
            pushMessages('assistant', response.content);
            initProgressBar(response.token_count);
        },
        error: function(xhr, status, error) {
            chatMessages.html(`<div class="notice" style="margin-top:85px">사건을 불러오는 데 실패했습니다.<br>새로고침 해주세요.</div>`)
            console.error('Error:', error);
        }
    });
}

/** 현재 게임에 대해 이어서 조사를 진행합니다. */
function inquiry() {
    const message = $('#input-text').val();
    sendPossible = false;
    emptyTextarea();

    addLog(true, message);
    addLog(false);

    $.ajax({
        type: 'POST',
        url: '/openai/inquiry',
        data: JSON.stringify({ messages: [...messages, {role: 'user', content: message}] }),
        contentType: 'application/json',
        success: function(response) {
            sendPossible = true;
            checkSendPossible();
            pushMessages('user', message);
            pushMessages('assistant', response.content);
            replaceLoadingLog(200, response.content);
            updateProgressBar(response.token_count);
        },
        error: ajaxErrorHandler
    });
}

/**
 * AJAX 요청 실패를 처리하는 함수입니다.
 * @param {*} xhr 
 * @param {*} status 
 * @param {*} error 
 */
function ajaxErrorHandler(xhr, status, error) {
    sendPossible = true;
    checkSendPossible();
    replaceLoadingLog(xhr.status);
    console.error('Error:', error);
}