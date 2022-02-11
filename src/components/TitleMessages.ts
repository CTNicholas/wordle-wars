function wordToBoard (word: string, state: string = 'correct') {
  return [[...word].map(letter => ({ letter, state }))]
}

const enterYourName = [
  [
    { letter: 'e', state: 'correct' },
    { letter: 'n', state: 'correct' },
    { letter: 't', state: 'correct' },
    { letter: 'e', state: 'correct' },
    { letter: 'r', state: 'correct' }
  ],
  [
    { letter: 'y', state: 'present' },
    { letter: 'o', state: 'present' },
    { letter: 'u', state: 'present' },
    { letter: 'r', state: 'present' },
    { letter: '', state: 'absent' },
  ],
  [
    { letter: '', state: 'absent' },
    { letter: 'n', state: 'correct' },
    { letter: 'a', state: 'correct' },
    { letter: 'm', state: 'correct' },
    { letter: 'e', state: 'correct' },
  ]
]

const fight = [
  [
    { letter: 'f', state: 'correct' },
    { letter: 'i', state: 'correct' },
    { letter: 'g', state: 'correct' },
    { letter: 'h', state: 'correct' },
    { letter: 't', state: 'correct' }
  ],
]

const connecting = [
  [
    { letter: 'a', state: 'correct' },
    { letter: 'r', state: 'correct' },
    { letter: 'e', state: 'correct' },
    { letter: '', state: 'absent' },
    { letter: '', state: 'absent' }
  ],
  [
    { letter: '', state: 'absent' },
    { letter: '', state: 'absent' },
    { letter: 'y', state: 'present' },
    { letter: 'o', state: 'present' },
    { letter: 'u', state: 'present' },
  ],
  [
    { letter: 'r', state: 'correct' },
    { letter: 'e', state: 'correct' },
    { letter: 'a', state: 'correct' },
    { letter: 'd', state: 'correct' },
    { letter: 'y', state: 'correct' },
  ]
]

export default { wordToBoard, connecting, fight, enterYourName }

/*
export const connecting = [
  [
    { letter: 'w', state: 'correct' },
    { letter: '', state: 'absent' },
    { letter: '', state: 'absent' },
    { letter: '', state: 'absent' },
    { letter: '', state: 'absent' }
  ],
  [
    { letter: 'o', state: 'correct' },
    { letter: '', state: 'absent' },
    { letter: '', state: 'absent' },
    { letter: '', state: 'absent' },
    { letter: '', state: 'absent' }
  ],
  [
    { letter: 'r', state: 'correct' },
    { letter: 'd', state: 'correct' },
    { letter: 'l', state: 'correct' },
    { letter: 'e', state: 'correct' },
    { letter: '', state: 'absent' }
  ],
  [
    { letter: '', state: 'absent' },
    { letter: 'w', state: 'present' },
    { letter: 'a', state: 'present' },
    { letter: 'r', state: 'present' },
    { letter: 's', state: 'present' }
  ],
  [
    { letter: '', state: 0 },
    { letter: '', state: 0 },
    { letter: '', state: 0 },
    { letter: '', state: 0 },
    { letter: '', state: 0 }
  ],
  [
    { letter: '', state: 0 },
    { letter: '', state: 0 },
    { letter: '', state: 0 },
    { letter: '', state: 0 },
    { letter: '', state: 0 }
  ],
]

 */

/*
export const connecting = [
  [
    { letter: 'w', state: 'correct' },
    { letter: 'a', state: 'present' },
    { letter: 'r', state: 'present' },
    { letter: 's', state: 'present' },
    { letter: '', state: 'absent' }
  ],
  [
    { letter: 'o', state: 'correct' },
    { letter: '', state: 'absent' },
    { letter: '', state: 'absent' },
    { letter: '', state: 'absent' },
    { letter: '', state: 'absent' }
  ],
  [
    { letter: 'r', state: 'correct' },
    { letter: '', state: 'absent' },
    { letter: '', state: 'absent' },
    { letter: '', state: 'absent' },
    { letter: '', state: 'absent' }
  ],
  [
    { letter: 'd', state: 'correct' },
    { letter: '', state: 'absent' },
    { letter: '', state: 'absent' },
    { letter: '', state: 'absent' },
    { letter: '', state: 'absent' }
  ],
  [
    { letter: 'l', state: 'correct' },
    { letter: '', state: 'absent' },
    { letter: '', state: 'absent' },
    { letter: '', state: 'absent' },
    { letter: '', state: 'absent' }
  ],
  [
    { letter: 'e', state: 'correct' },
    { letter: '', state: 0 },
    { letter: '', state: 0 },
    { letter: '', state: 0 },
    { letter: '', state: 0 }
  ],
]

 */


/*
export const connecting = [
  [
    { letter: 'a', state: 'correct' },
    { letter: 'r', state: 'correct' },
    { letter: 'e', state: 'correct' },
    { letter: '', state: 'absent' },
    { letter: '', state: 'absent' }
  ],
  [
    { letter: '', state: 'absent' },
    { letter: '', state: 'absent' },
    { letter: 'y', state: 'present' },
    { letter: 'o', state: 'present' },
    { letter: 'u', state: 'present' },
  ],
  [
    { letter: 'r', state: 'correct' },
    { letter: 'e', state: 'correct' },
    { letter: 'a', state: 'correct' },
    { letter: 'd', state: 'correct' },
    { letter: 'y', state: 'correct' },
  ],
  [
    { letter: 'f', state: 'present' },
    { letter: 'o', state: 'present' },
    { letter: 'r', state: 'present' },
    { letter: '', state: 'absent' },
    { letter: '', state: 'absent' },
  ],
  [
    { letter: '', state: 'absent' },
    { letter: 'w', state: 'correct' },
    { letter: 'a', state: 'correct' },
    { letter: 'r', state: 'correct' },
    { letter: '?', state: 'correct' },
  ],
  []
]


 */
