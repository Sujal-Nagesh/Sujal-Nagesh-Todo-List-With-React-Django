import React from 'react';

const TodoFilter = ({ filter_todo }) => {
  return (
    <select name="" id="" onChange={(e) => filter_todo(e.target.value)}>
      <option value="All">All</option>
      <option value="Active">Active</option>
      <option value="Completed">Completed</option>
    </select>
  );
}

export default TodoFilter;