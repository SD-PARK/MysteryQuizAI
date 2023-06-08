/**
 * OpenAI API를 통해 생성한 텍스트와 현재 토큰 사용량이 포함된 DTO 입니다.
 */
export class TextWithTokenCountDto {
    readonly content: string;
    readonly token_count: number;
}