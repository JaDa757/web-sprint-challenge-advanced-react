import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // For additional matchers

import AppClass from './AppClass'; // Replace with the correct import path

// A simple test case to check if the component renders without crashing
test('renders without errors', () => {
  render(<AppClass />);
});

