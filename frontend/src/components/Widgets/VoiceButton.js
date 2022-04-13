import React, {useEffect} from "react"
import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition"
import Button from "react-bootstrap/Button"

// Icons
import MicrophoneWhite from "../../assets/mic_white.svg"

/**
 * The VoiceButton method, uses the react-speech-recognition package,
 * when the user clicks the voice button, the browser will listen and
 * attempt to recognise words, then convert the speech to text.
 *
 * @param props - props passed in
 *
 * @author - Alex Thompson, W19007452
 */

const VoiceButton = (props) => {
  // get the speech recognition transcript
  let supportedBrowser = true
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition()

  // document.querySelectorAll(('.modal-background') || []).forEach((close) => {
  //   close.addEventListener('click', () => {
  //     props.closeModal()
  //     resetTranscript()
  //   })
  // })

  // if the browser does not support speech recognition
  // alert the user
  if (!browserSupportsSpeechRecognition) {
    alert("Speech Recognition is not supported")
    supportedBrowser = false
  }

  useEffect(() => {
    if (supportedBrowser) {
      // if (listening) {
      //   wait(500).then(() => {
      //     console.log(transcript)
      //     props.updateVoiceModal(transcript)
      //   })
      // }

      let listeningPara = document.getElementById("listening")

      if (listening) {
        listeningPara.classList.remove("is-hidden")
      }

      if (!listening) {
        listeningPara.classList.add("is-hidden")
      }

      // after the browser stops listening, get the transcript then
      // reset the transcript
      if ((!listening) && (transcript.trim() !== "")) {
        props.handleVoice(transcript)
        resetTranscript()
      }
    }
  })

  return (
    <Button
      className="voice-button"
      onClick={() => {
        SpeechRecognition.startListening()
        // props.displayVoiceModal()
      }}
    >
      <img src={MicrophoneWhite} alt="Microphone Icon" />
    </Button>
  )
}

export default VoiceButton