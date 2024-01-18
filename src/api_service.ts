import { Convert, Joke } from "./model/joke";

const HOST = "https://api.chucknorris.io"

export default function fecthForRandomJoke() {
    fetch(`${HOST}/jokes/random`)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(handleError)
}

function handleError(error: any) {
    console.log(`Something went wrong: ${error}`)    
}