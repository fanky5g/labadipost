export function setStories(data) {
  return {
    type: 'SET_STORIES',
    cursor: data.cursor,
    stories: data.stories,
  };
}

export function setCategories(categories) {
  return {
    type: 'SET_CATEGORIES',
    categories: categories,
  };
}

export function setActive(name) {
  return {
    type: 'SET_ACTIVE_CATEGORY',
    name: name,
  };
}