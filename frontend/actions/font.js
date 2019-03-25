export const SET_FONT_LOADED = 'set_font_loaded';

export const setFontLoaded = (boolean) => {
  return {
    type: SET_FONT_LOADED,
    payload: boolean
  };
}