import { expect } from '@jest/globals';
import { nearly } from './jest-extend-nearly.js';


// Register custom matchers globally for all test files.
expect.extend(nearly);
