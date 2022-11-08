import React from 'react';
import { render, screen } from '@testing-library/react';
import { Model } from './model/Model.js';
//default puzzle to use
import {level1} from './model/Puzzle.js';
var firstLevel = JSON.parse(JSON.stringify(level1));

var model = new Model(firstLevel);

test('No moves when mode created', () => {
  expect(model.numMoves).toBe(0);
});
