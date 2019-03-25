export const findByTestAttr = (component, attr)  => {
    const wrapper = component.find(`[testID='${attr}']`);
    return wrapper
  }
  