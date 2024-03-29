import OpenAI from "openai";
import { ChatCompletion } from "openai/resources";

export class ApiService {

    private openAi = new OpenAI({
        apiKey : API_KEY
    })

    public async checkByUrl(url: string): Promise<ChatCompletion> {
        return this.openAi.chat.completions.create({
            messages: [{ role: "system", content: this.getCheckPromt(url) }],
            model: "gpt-3.5-turbo",
          });
    }

    public async isArticle(url: string): Promise<ChatCompletion> {
        return this.openAi.chat.completions.create({
            messages: [{ role: "system", content: this.getIsArticlePromt(url) }],
            model: "gpt-3.5-turbo",
          });
    }

    private getCheckPromt(url: string): string {
        return `${url} Please analyze the main thesis or argument of the article and compare it with relevant statistical data and information you have access to. I am interested in whether the claims made in the article are supported or contradicted by the data. Try to give an answer in range of 100 to 150 words. Format answer as bulleted list`
    }

    private getIsArticlePromt(url: string): string {
        return `can you classify information on this page ${url} as an article? Reply with one word either "yes" or "no"`
    }

}


