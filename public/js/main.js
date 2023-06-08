$(document).ready(() => {
    newGame();
});

/**
 * 메시지 데이터의 유효성 검사를 진행하는 함수입니다.
 * 게임이 종료되었을 경우, 'NEWGAME' 명령어를 입력했을 경우의 분기를 분리합니다.
 */
function checkMessage() {
    const message = $('#input-text').val();
    console.log(progress.value, progress.max);
    if (message === 'NEWGAME') {
        emptyTextarea();
        addLog(true, message);
        addLog(false);
        replaceLoadingLog(200, `새로운 게임을 시작합니다.`);
        sendPossible = false;
        setTimeout(() => {
            newGame();
        }, 3000)
        return false;
    } else if (progress.value === progress.max) {
        emptyTextarea();
        addLog(true, message);
        addLog(false);
        replaceLoadingLog(200, `게임이 종료되었습니다.<br>'NEWGAME' 명령어를 입력해 새로운 게임을 시작하세요.`);
        return false;
    }
    return true;
}