export abstract class State { }

export class MainScreenState implements State {
    isLoading: boolean = false;
    isNotAnArticle: boolean = false;
    summary: string | null = null
    errorMessage: string | null = null

    public updateLoading() {
        this.isLoading = true
        this.isNotAnArticle = false
        this.summary = null
        this.errorMessage = null
    }

    public updateNotAnArticle(message: string) {
        this.isLoading = false
        this.isNotAnArticle = true
        this.summary = null
        this.errorMessage = message
    }

    public updateSummary(summary: string){
        this.isLoading = false
        this.isNotAnArticle = false
        this.summary = summary
        this.errorMessage = null
    }
}