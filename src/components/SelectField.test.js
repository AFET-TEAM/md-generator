import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SelectField from './SelectField';

describe('SelectField Performance', () => {
  test('SelectField component is wrapped in React.memo', () => {
    const RealSelectField = require('./SelectField').default;
    expect(String(RealSelectField.$$typeof)).toContain('react.memo');
  });
});
