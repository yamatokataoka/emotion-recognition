// actions
const TOGGLE_STATS = "features/stats/TOGGLE_STATS";

// initial state
const initialState = {
  statsOn: true,
  currentEmotion: "Emotion",
  currentEmotions: "Emotions",
};


// Reducer
export default function reducer( state = initialState, action = {} ) {
  switch ( action.type ) {
    case TOGGLE_STATS:
      return {
        ...state,
        statsOn: !state.statsOn,
      };
    default: return state;
  }
}

// action creators
export function toggleStats() {
  return { type: TOGGLE_STATS };
}
