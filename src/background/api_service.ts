import OpenAI from "openai";

const HOST = "https://api.chucknorris.io"

export class ApiService {

    private openAi = new OpenAI({
        //TODO: GET RID OF THIS!!!
        apiKey : "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"
    })

    public async checkByUrl(url: string, callback: (resultMessage: string | null) => void) {
        const completion = await this.openAi.chat.completions.create({
            messages: [{ role: "system", content: this.getCheckPromt(url) }],
            model: "gpt-3.5-turbo",
          });
        
          console.log("checkByUrl", completion)
          var resultMessage = completion.choices[0].message.content
          callback(resultMessage)
    }

    public async isArticle(url: string, callback: (response: boolean) => void) {
        const completion = await this.openAi.chat.completions.create({
            messages: [{ role: "system", content: this.getIsArticlePromt(url) }],
            model: "gpt-3.5-turbo",
          });

          console.log("isArticle", completion)
          var resultMessage = completion.choices[0].message.content
          callback(this.mapToBool(resultMessage))
    }

    private mapToBool(response: string| null): boolean {
        return response?.toLowerCase() === "Yes".toLowerCase()
    }
    
    private getCheckPromt(url: string): string {
        return `${url} Please analyze the main thesis or argument of the article and compare it with relevant statistical data and information you have access to. I am interested in whether the claims made in the article are supported or contradicted by the data. Try to give an answer in range of 100 to 150 words`
    }

    private getIsArticlePromt(url: string): string {
        return `can you classify information on this page ${url} as an article? Reply with one word either "yes" or "no"`
    }

}


