import React, {useEffect} from "react"
import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition"
import Button from "react-bootstrap/Button"

// Icons
import MicrophoneBlack from "../../assets/mic_black.svg"
import MicrophoneWhite from "../../assets/mic_white.svg"
import {wait} from "@testing-library/user-event/dist/utils";

const VoiceButton = (props) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition()

  document.querySelectorAll(('.modal-background') || []).forEach((close) => {
    close.addEventListener('click', () => {
      props.closeModal()
      resetTranscript()
    })
  })

  if (!browserSupportsSpeechRecognition) {
    alert("Speech Recognition is not supported")
  }

  useEffect(() => {
    // if (listening) {
    //   wait(500).then(() => {
    //     console.log(transcript)
    //     props.updateVoiceModal(transcript)
    //   })
    // }

    if (listening) {
      document.getElementById("listening").classList.remove("is-hidden")
    }

    if (!listening) {
      document.getElementById("listening").classList.add("is-hidden")
    }

    if ((!listening) && (transcript.trim() !== "")) {
      props.handleVoice(transcript)
      resetTranscript()
    }
  })

  return (
      <Button
          onClick={() => {
            SpeechRecognition.startListening()
            // props.displayVoiceModal()
          }}
          style={{borderBottomRightRadius: "0", borderTopRightRadius: "0"}}
      >
        <img src={MicrophoneWhite} alt="Microphone Icon" />
      </Button>
  )
}

export default VoiceButton