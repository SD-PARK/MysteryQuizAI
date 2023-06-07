$(document).ready(function() {
    const inputText = $('#input-text');
    const chatMessages = $('#chat-messages');
    const messages = [];

    function pushMessages(role, content) {
        messages.push({
            role: role,
            content: content
        });
    }

    // 메시지 전송 이벤트 진입 관련
    $('#send-button').click(function() { inquiry() });
    $('#input-text').keydown(function(event) {
        if (event.keyCode === 13 && !event.shiftKey && sendPossible) {
            inquiry();    
            event.preventDefault();
        }
    });

    /**
     * 새로운 게임을 요청합니다.
     */
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

    /**
     * 현재 게임에 대한 조사를 진행합니다.
     */
    function inquiry() {
        const data = { message: inputText.val() };
        sendPossible = false;
        inputText.val('');
        buttonDisabled();

        $.ajax({
            type: 'POST',
            url: '/openai',
            data: [...messages, {role: 'user', content: data}],
            contentType: 'application/json',
            success: function(response) {
                chatMessages.html(response);
                sendPossible = true;
                checkSendPossible();
                pushMessages('user', data);
                pushMessages('assistant', response);
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
                chatMessages.html('문제를 불러올 수 없어요.\n새로고침 해주세요.');
                sendPossible = true;
                checkSendPossible();
            }
        });
    }

    newGame();
});