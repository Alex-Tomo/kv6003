import HomePage from "./pages/HomePage"
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition"

function App() {

  const {transcript, resetTranscript} = useSpeechRecognition()

  return (
    <div className="App">
      <HomePage/>
    </div>
  );
}

export default App
