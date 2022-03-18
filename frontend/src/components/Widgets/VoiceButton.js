import React, {useEffect} from "react"
import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition"
import Button from "react-bootstrap/Button"

// Icons
import MicrophoneBlack from "../../assets/mic_black.svg"
import MicrophoneWhite from "../../assets/mic_white.svg"

const VoiceButton = (props) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition()

  if (!browserSupportsSpeechRecognition) {
    alert("Speech Recognition is not supported")
  }

  useEffect(() => {
    if ((!listening) && (transcript.trim() !== "")) {
      props.handleVoice(transcript)
      resetTranscript()
    }
  })

  return (
      <Button
          onClick={SpeechRecognition.startListening}
          style={{borderBottomRightRadius: "0", borderTopRightRadius: "0"}}
      >
        <img src={MicrophoneWhite} alt="Microphone Icon" />
      </Button>
  )
}

export default VoiceButton