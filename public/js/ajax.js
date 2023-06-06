$(document).ready(function() {
    const inputText = $('#input-text');
    const chatMessages = $('#chat-messages');

    // 메시지 전송 이벤트 진입 관련
    $('#send-button').click(function() { askQuestion() });
    $('#input-text').keydown(function(event) {
        if (event.keyCode === 13 && !event.shiftKey && sendPossible) {
            askQuestion();    
            event.preventDefault();
        }
    });

    function askQuestion() {
        const data = { message: inputText.val() };
        sendPossible = false;
        inputText.val('');
        buttonDisabled();

        $.ajax({
            type: 'GET',
            url: '/openai',
            contentType: 'application/json',
            success: function(response) {
                chatMessages.html(response);
                sendPossible = true;
                checkSendPossible();
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
                chatMessages.html('문제를 불러올 수 없어요.\n새로고침 해주세요.');
                sendPossible = true;
                checkSendPossible();
            }
        });
    }
});