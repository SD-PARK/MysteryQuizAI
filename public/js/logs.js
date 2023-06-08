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
 * @param {number} status - ajax 요청에 대한 status 값
 * @param {string} content - 로그 안에 들어갈 내용
 */
function replaceLoadingLog(status, content = '') {
    const loadingDiv = $('.loading');
    if (status === 200) {
        loadingDiv.html(content);
    } else if (status === 400) {
        updateProgressBar(4097);
        loadingDiv.html(`시간이 초과되었습니다.<br>사건은 종결되었으며, 충분한 단서를 수집하지 못해 사건의 결론은 영영 알 수 없는 미궁 속으로 빠지게 되었습니다.<br>새로운 게임을 시작하려면 'NEWGAME' 명령어를 입력하세요!`);
    } else {
        loadingDiv.html(`문제를 불러오지 못했어요.<br>다시 질문해주세요.`);
        setTimeout(() => { loadingDiv.remove(); }, 3000);
    }
    loadingDiv.removeClass('loading');
    chatLogs.scrollTop(chatLogs.prop('scrollHeight'));
}