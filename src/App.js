import React, { useState, useRef } from 'react'
import { Button } from './components/Result/styled'
import AnswerBox from './components/AnswerBox'
import FailBox from './components/FailBox'
import Result from './components/Result'
import Human from './components/Human'
import {
  Gallow,
  DownPipe,
  RightBlueTriangle,
  Input,
  AppWrapper,
  GameInstruction,
} from './styled'

export default () => {
  const [wordFromAPI, setWordFromAPI] = useState([])
  const [isPaused, setIsPaused] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)
  const [resultBox, setResultBox] = useState({
    disabled: false,
    title: 'Hangman',
    buttonLabel: 'Start Game',
  })
  const [failedLetters, setFailedLetters] = useState([])
  const [correctLetters, setCorrectLetters] = useState([])
  const [word, setWord] = useState('')
  const inputRef = useRef(null)

  const handOnKeyPress = event => {
    let keyChar = event.key
    event.preventDefault()
    if (
      wordFromAPI.length > 0 &&
      'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'.indexOf(keyChar) >
        -1
    ) {
      keyChar = keyChar.toUpperCase()
      if (
        !failedLetters.find(x => x === keyChar) &&
        !correctLetters.find(x => x === keyChar)
      ) {
        let count = 0
        for (let i = 0; i < wordFromAPI.length; i++) {
          if (keyChar === wordFromAPI[i]) {
            count++
            const newCorrectLetters = correctLetters.concat([keyChar])
            setCorrectLetters(newCorrectLetters)
            countCorrectLetters(newCorrectLetters)
            return
          }
        }
        if (count === 0) {
          if (failedLetters.length === 10) {
            setResultBox({
              disabled: false,
              title: `Game Over { word: ${word} }`,
              buttonLabel: 'Restart Game',
            })
            setIsGameOver(true)
          }
          setFailedLetters(failedLetters.concat([keyChar]))
        }
      }
    }
  }

  const emptyBoxList = () => {
    let arrayOfSpace = []
    if (wordFromAPI.length > 0) {
      const arraySize = wordFromAPI.length
      for (let x = 0; x < 12 - arraySize; x++) {
        arrayOfSpace.push(' ')
      }
    }
    return arrayOfSpace
  }

  const startGame = () => {
    setResultBox({
      disabled: true,
    })
    setFailedLetters([])
    setCorrectLetters([])
    setWordFromAPI([])
    setWord('')
    getWord()
    setIsGameOver(false)
    inputRef.current.focus()
  }

  const continueGame = () => {
    setResultBox({
      disabled: true,
    })
    inputRef.current.focus()
  }

  const wordSetter = word => {
    let wordArr = word.toUpperCase().split('')
    wordArr.map(item => {
      item === '-' && wordArr.splice(wordArr.indexOf('-'), 1)
      item === ' ' && wordArr.splice(wordArr.indexOf(' '), 1)
      return item
    })

    setWordFromAPI(wordArr)
    setWord(word)
  }

  const getWord = () => {
    wordSetter("Vanessa")
  }

  const countCorrectLetters = correctLetters => {
    let uniqueLetters = filterUniqueItems(wordFromAPI)
    if (correctLetters.length === uniqueLetters.length) {
      setResultBox({
        disabled: false,
        title: '★ You Won! ★',
        buttonLabel: 'Restart Game',
      })
      setIsGameOver(true)
    }
  }

  const filterUniqueItems = items => {
    const obj = {},
      uniqueItems = []
    for (var i = 0, l = items.length; i < l; ++i) {
      if (obj.hasOwnProperty(items[i])) {
        continue
      }
      uniqueItems.push(items[i])
      obj[items[i]] = 1
    }
    return uniqueItems
  }

  return (
    <AppWrapper>
      <GameInstruction>Press any keys (letters) to play.</GameInstruction>

      <Gallow>
        <DownPipe />
        <Input
          ref={inputRef}
          {...(!isGameOver && !isPaused && { onKeyDown: handOnKeyPress })}
          onFocus={() => setIsPaused(false)}
          onBlur={() => {
            if (!isGameOver) {
              setIsPaused(true)
              setResultBox({
                title: 'Game is Paused',
                disabled: false,
                buttonLabel: 'continue',
              })
            }
          }}
        />
      </Gallow>
      <Human failedLetterCount={failedLetters.length} />

      <FailBox failedLetters={failedLetters} />
      <AnswerBox
        wordFromAPI={wordFromAPI}
        correctLetters={correctLetters}
        spaces={emptyBoxList()}
      />

      <RightBlueTriangle />
      <Result
        title={resultBox.title}
        disabled={resultBox.disabled}
        buttonLabel={resultBox.buttonLabel}
        buttonAction={isPaused ? continueGame : startGame}
      />
      {!isPaused && <Button pause> Pause Game</Button>}
    </AppWrapper>
  )
}
