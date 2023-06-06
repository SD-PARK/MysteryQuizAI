type role = 'system' | 'user' | 'assistant';

export class Message {
    role: role;
    content: string;

    constructor(role: role, content: string) {
        this.role = role;
        this.content = content;
    }
}