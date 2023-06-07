const chatLogs = $('#chat-logs');

/**
 * 채팅 로그를 추가합니다.
 * @param {boolean} me - 유저가 보냈는 지에 대한 여부
 * @param {string} content - 로그 안에 들어갈 내용
 */
function addLog(me, content = '') {
    if (me) { chatLogs.append(`<div class="log me">${content}</div>`); }
    else { chatLogs.append(`<div class="log loading"><div class="loader small"></div></div>`); }
    chatLogs.scrollTop(chatLogs.prop('scrollHeight'));
}

/**
 * 로딩 중인 로그의 내용을 변경하거나, 제거합니다.
 * @param {boolean} status - ajax 요청 성공 여부
 * @param {string} content - 로그 안에 들어갈 내용
 */
function replaceLoadingLog(status, content = '') {
    const loadingDiv = $('.loading');
    if (status) {
        loadingDiv.html(content);
    } else {
        loadingDiv.html(`문제를 불러오지 못했어요.<br>다시 질문해주세요.`);
        setTimeout(() => { loadingDiv.remove(); }, 3000);
    }
    loadingDiv.removeClass('loading');
    chatLogs.scrollTop(chatLogs.prop('scrollHeight'));
}