# Analyze With Magnus
An uncontinued chess analysis project, using the Stockfish Engine and OpenAI API to analyze chess.com matches

## 🤔 How it works...
* The [chess.com api](https://chess.com/developers) is used to fetch the user profile and their recent matches.
  
* The PGN (Portable Game Notation) of the match is fetched.
  
* The [chess.js](https://www.npmjs.com/package/chess.js) library is used to handle the state of the match, and the [chessboardjsx](https://www.npmjs.com/package/chessboardjsx) library to display the chess board.
  
* Upon sending a prompt to the chatbot (Magnus Character), a special prompt is sent to the OpenAI API, explaining the current FEN position and PGN of the match, along with the best move in the current position according to the stockfish engine. The prompt explains wether the user is playing with the white or black pieces and whose turn it is in the custom position that the user stops and asks the prompt at.
  
* The OpenAI API generates a friendly reply to answer the user's question, based on the knowledge of the current position and the game.

## 🤓 Technologies Used
* ReactJS Framework
* Tailwind CSS
* [Chess.js Library](https://www.npmjs.com/package/chess.js)
* [Chessboardjsx Library](https://www.npmjs.com/package/chessboardjsx)
* [Stockfish.js WASM](https://github.com/nmrugg/stockfish.js)
* [OpenAI API](https://openai.com/) (Not Implemented Completely Into Project)
  
## 📷 Screenshots

## 🌻 Conclusion
This project's basic idea is completed, however the OpenAI technology is not implemented, and you are free to implement it, using your own approach and OpenAI API Key. You are also free to contribute and improve this project. Pull requests are accepted.
