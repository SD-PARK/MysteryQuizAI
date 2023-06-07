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

/** 새로운 게임을 요청합니다. */
function newGame() {
    sendPossible = false;
    buttonDisabled();

    $.ajax({
        type: 'GET',
        url: '/openai',
        contentType: 'application/json',
        success: function(response) {
            chatMessages.html(response);
            sendPossible = true;
            checkSendPossible();
            pushMessages('assistant', response);
        },
        error: function(xhr, status, error) {
            chatMessages.html('문제를 불러올 수 없어요.\n새로고침 해주세요.');
            sendPossible = true;
            checkSendPossible();
            console.error('Error:', error);
        }
    });
}

/** 현재 게임에 대한 조사를 진행합니다. */
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
            pushMessages('assistant', response);
            replaceLoadingLog(true, response);
        },
        error: function(xhr, status, error) {
            sendPossible = true;
            checkSendPossible();
            replaceLoadingLog(false);
            console.error('Error:', error);
        }
    });
}