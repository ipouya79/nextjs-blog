const cityInitState = [];

const cityReducer = (state, action) => {
  switch (action.type) {
    case 'addCity': {
      let newState = state.concat({
        city: action.payload.city,
        id: action.payload.id,
      });

      return newState;
    }
    case 'removeCity': {
      let newState = state.filter((itm) => {
        return itm.id !== action.payload.id;
      });

      return newState;
    }

    default:
      return state;
  }
};

module.exports = { cityReducer, cityInitState };
