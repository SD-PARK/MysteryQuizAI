# MysteryQuizAI
<img src="https://github.com/SD-PARK/MysteryQuizAI/assets/97375357/0fc96af3-fae0-44bf-98a8-b564ce995b17" width="1000"/>

OpenAI API 기반의 대화형 추리 퀴즈 사이트

## 🎉 프로젝트 소개
OpenAI API를 기반으로 한 **실시간 대화형 추리 퀴즈 플랫폼**입니다.

**AI가 독자적으로 추리 퀴즈를 생성**하고, 사용자는 그에 대한 답변을 제출해 **정답을 맞추는 퀴즈 게임**입니다.

단순히 질문과 답변만 존재하는 추리 퀴즈와 다르게, **AI와의 실시간 상호작용**을 통해 다양한 유형의 질문과 퀴즈에 대해

**대화 형식으로 대응**할 수 있기 때문에 퀴즈의 답을 찾아내는 과정에서 더욱 흥미로운 경험을 제공할 수 있습니다.

## 👀 프로젝트 정보
### 테스트 링크
http://mystery-quiz-ai.site/

### 개발 스택
<img src ="https://img.shields.io/badge/TYPESCRIPT-3178C6.svg?&style=for-the-badge&logo=TypeScript&logoColor=white"/> <img src ="https://img.shields.io/badge/NESTJS-E0234E.svg?&style=for-the-badge&logo=NestJS&logoColor=white"/> <img src ="https://img.shields.io/badge/EXPRESS-000000.svg?&style=for-the-badge&logo=Express&logoColor=white"/> <img src ="https://img.shields.io/badge/OPENAI-412991.svg?&style=for-the-badge&logo=OpenAI&logoColor=white"/>

## 💬 실행 방법

### 요구사항
- Node.js (v16 or above)
- npm (Node Package Manager)

### 설치
1. 레파지토리를 클론합니다.
```bash
$ git clone https://github.com/SD-PARK/MysteryQuizAI.git
```

2. 프로젝트 디렉토리로 이동합니다.
```bash
$ cd MysteryQuizAI.git
```

3. 필요한 패키지를 설치합니다.
```bash
$ npm install
```

### 환경 설정
이 프로젝트는 OpenAI API를 사용하므로, OpenAI API Key가 필요합니다. 아래는 .env 파일에 OpenAI API Key를 추가하는 방법입니다.

1. OpenAI 계정을 생성하고 로그인합니다.

2. OpenAI API Key를 발급받기 위해 다음 단계를 진행합니다.
   - [OpenAI 공식 웹사이트](https://openai.com/)에 접속합니다.
   - 개인 계정으로 로그인합니다.
   - 계정 설정의 View API keys 항목을 찾아 API Key를 발급받습니다.
   - API Key를 안전한 곳에 저장해둡니다.

3. 프로젝트 루트 디렉토리에 `.env` 파일을 생성합니다.

4. `.env` 파일을 텍스트 편집기로 열고 다음과 같이 작성합니다.

   ```plaintext
   OPENAI_API_KEY=Enter_Your_OpenAI_API_Key_Here
    ```

    위 줄에서 Enter_Your_OpenAI_API_Key_Here 부분을 실제로 발급받은 OpenAI API Key로 대체합니다.

5. .env 파일을 저장합니다.

6. 이제 서버를 실행할 때 .env 파일이 자동으로 로드되고, ConfigService를 통해 OpenAI API Key에 액세스할 수 있습니다.

### 실행 방법
1. 다음 명령을 통해 개발 서버를 실행할 수 있습니다.
```bash
$ npm run start:dev
```
API 서버는 기본적으로 3000번 포트에서 실행됩니다.

2. 웹 브라우저에 다음 URL을 입력합니다.
```
http://localhost:3000
```

### API 엔드포인트
GET `/`: 추리 퀴즈 페이지를 반환합니다.
    
GET `/openai`: OpenAI API를 통해 추리 퀴즈를 생성합니다.

POST `/openai/inquiry`: OpenAI API를 통해 다중 턴 대화를 진행합니다.

각 엔드포인트 및 요청과 응답 형식에 대한 자세한 내용은 API 문서를 참조하세요.

## 🎫 API 문서
### ```GET /```

추리 퀴즈 페이지를 반환합니다.

#### 요청
없음

#### 응답
성공 (200): 추리 퀴즈 페이지를 포함하는 HTML 응답

---
### ```GET /openai```

OpenAI API를 통해 추리 퀴즈를 생성합니다.

#### 요청
없음

#### 응답
- 성공 (200 OK): 생성된 추리 퀴즈에 대한 정보와 토큰 사용량을 포함하는 JSON 응답
- 실패 (500 Internal Server Error): OpenAI API와 연결 불가(API Key가 다르거나, 시간당 요청 횟수 초과)

---
### ```POST /openai/inquiry```

OpenAI API를 통해 다중 턴 대화를 진행합니다.

#### 요청
```typescript
class MessageDto {
    role: "system" | "user" | "assistant";
    content: string;
}
```

#### 응답
- 성공 (200 OK): 대화 진행 결과와 토큰 사용량을 포함하는 JSON 응답
- 실패 (400 Bad Request): 다중 턴 대화 진행에 필요한 최대 토큰 수 초과
- 실패 (500 Internal Server Error): OpenAI API와 연결 불가(API Key가 다르거나, 시간당 요청 횟수 초과)

---

## ✨ 주요 코드

#### src/openai/openai.service.ts

```typescript
/**
* OpenAI API에 접근해 대화를 생성하는 함수입니다.
* @param messages - 대화에 사용될 메시지 배열입니다.
* @returns {Promise<string>} 생성된 대화문입니다.
* @throws 대화 생성에 실패한 경우 'Failed to generate chat.', 토큰을 전부 사용했을 경우 `텍스트 입력이 최대 토큰 수를 초과했습니다.` 예외가 발생합니다.
*/
async generateChat(messages: MessageDto[]): Promise<TextWithTokenCountDto> {
    try {
        const response = await this.openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: messages,
        });
        const responseObject: TextWithTokenCountDto = {
            content: response.data.choices[0].message.content,
            token_count: response.data.usage.total_tokens,
        }
        return responseObject;
    } catch (err) {
        this.logger.error('Error occurred:', err);
        if (err.message === 'Request failed with status code 400') {
            throw new BadRequestException('텍스트 입력이 최대 토큰 수를 초과했습니다.');
        } else {
            throw new Error('대화 생성에 실패했습니다.');
        }
    }
}
```

OpenAI API에 접근해 대화를 생성하는 함수입니다.

대화 로그가 담긴 배열을 messages 변수를 통해 API에 건네주면, 'gpt-3.5-turbo' 모델이 대화 로그와 유저의 질문을 분석해 적절한 답변을 반환합니다.

현재 토큰 사용량을 통해 게임의 진행 정도를 파악하기 때문에, 'TextWithTokenCountDto'객체에 AI의 답변과 현재까지 토큰 사용량을 담아 클라이언트에게 반환합니다.

---
