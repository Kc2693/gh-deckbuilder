const addSelectedDeckIdReducer = (state = 0, action) => {
  console.log(action);
  switch (action.type) {
    case 'ADD_SELECTED_DECK_ID':
      return action.addDeckId;
    default:
      return state;
  }
};

export default addSelectedDeckIdReducer;