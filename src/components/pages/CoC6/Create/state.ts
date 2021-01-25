import { createAction, createReducer } from '@reduxjs/toolkit'

import { randomFace } from '@/components/atoms/Die'
import Dict from '@/utils/dict'

export type State = {
  pages: {
    [key: string]: {
      face: number
      flip: number
      sides: number
    }[]
  }[]
  index: number
}

export const createState = (
  config: Dict<string, number[]>,
  min = 5,
  max = 15
) => {
  const reroll = createAction<string | undefined>('reroll')
  const animate = createAction('animate')
  const older = createAction('older')
  const newer = createAction('newer')

  const initialState = {
    pages: [
      config.map((dice) =>
        dice.map((sides) => ({
          face: 0,
          flip: 0,
          sides,
        }))
      ),
    ],
    index: 0,
  }

  const reducer = createReducer(initialState, (builder) =>
    builder
      .addCase(reroll, ({ pages, index }, { payload }) =>
        !payload || config.has(payload)
          ? {
              pages: [
                pages[index].map((dice, key) =>
                  dice.map(({ face, flip, sides }) => ({
                    face,
                    flip:
                      !payload || key === payload
                        ? Math.floor(Math.random() * (max - min + 1)) + min
                        : flip,
                    sides,
                  }))
                ),
                ...pages,
              ],
              index: 0,
            }
          : { pages, index }
      )

      .addCase(animate, ({ pages, index }) => ({
        pages: pages.map((page) =>
          page.map((dice) =>
            dice.map(({ face, flip, sides }) => ({
              face: flip > 0 ? randomFace(sides, face) : face,
              flip: Math.max(0, flip - 1),
              sides,
            }))
          )
        ),
        index,
      }))

      .addCase(older, ({ pages, index }) => ({
        pages,
        index: Math.min(pages.length - 1, index + 1),
      }))

      .addCase(newer, ({ pages, index }) => ({
        pages,
        index: Math.max(0, index - 1),
      }))
  )

  const actions = {
    reroll,
    animate,
    older,
    newer,
  }

  return { initialState, reducer, actions }
}
