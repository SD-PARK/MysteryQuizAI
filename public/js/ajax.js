const chatMessages = $('#chat-messages');
const messages = [];

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

const manual = `<br><br>당신은 정해진 시간 내에 사건에 대한 단서를 수집하고, 결론을 도출해내어야 합니다.<br>주어진 명령어와 기지를 발휘해 최소한의 질문으로 게임을 클리어해보세요!`;
/** 새로운 게임을 요청합니다. */
function newGame() {
    sendPossible = false;
    buttonDisabled();

    $.ajax({
        type: 'GET',
        url: '/openai',
        contentType: 'application/json',
        success: function(response) {
            chatMessages.html(response.content + manual);
            sendPossible = true;
            checkSendPossible();
            pushMessages('assistant', response.content);
            initProgressBar(response.token_count);
        },
        error: ajaxErrorHandler
    });
}

/** 현재 게임에 대해 이어서 조사를 진행합니다. */
function inquiry() {
    const message = $('#input-text').val();
    sendPossible = false;
    $('#input-text').val('');
    buttonDisabled();
    
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
    replaceLoadingLog(status);
    console.error('Error:', error);
}