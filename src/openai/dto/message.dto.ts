import { IsIn, IsString } from "class-validator";

/**
 * OpenAI API에 전송되는 요청에 사용되는 메시지 DTO입니다.
 */
export class MessageDto {
    @IsIn(["system", "user", "assistant"])
    readonly role: "system" | "user" | "assistant";

    @IsString()
    readonly content: string;
}