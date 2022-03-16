import React from "react"
import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition"
import Button from "react-bootstrap/Button";

const VoiceButton = (props) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition()

  if (!browserSupportsSpeechRecognition) {
    alert("Speech Recognition is not supported")
    return
  }

  if ((!listening) && (transcript.trim() !== "")) {
    props.handleVoice(transcript)
    resetTranscript()
  }

  return (
    <Button
      id="button-addon1"
      onClick={SpeechRecognition.startListening}
      style={{borderBottomRightRadius: "0", borderTopRightRadius: "0"}}
    >
      Voice
    </Button>
  )
}

export default VoiceButton