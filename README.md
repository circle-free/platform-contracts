<p align="center"><img src="https://cdn.dribbble.com/users/1299339/screenshots/7133657/media/837237d447d36581ebd59ec36d30daea.gif" width="280"/></p>

<p align="center">Immutable is the creator behind the hit game - Gods Unchained. Here is a mono-repo containing all the code for our public contracts.</p>

<p align="center">
  <a href="https://solidity.readthedocs.io/en/develop/index.html">
    <img src="https://img.shields.io/badge/SOLIDITY-0.4.24-orange.svg" />
  </a>
  <a href="https://opensource.org/licenses/Apache-2.0">
    <img src="https://img.shields.io/badge/LICENSE-APACHE2.0-3DA639.svg" />
  </a>
</p>

## Packages :package:

### Published

|                            Package                             |                                                                Version                                                                |                           Description                           |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| [`@immutable/addresses`](/packages/addresses)                                     | [![npm](https://img.shields.io/npm/v/@immutable/addresses.svg)](https://www.npmjs.com/package/@immutable/addresses)                                                 | Public addresses of deloyed contracts       |
| [`@immutable/artifacts`](/packages/artifacts)                                   | [![npm](https://img.shields.io/npm/v/@immutable/artifacts.svg)](https://www.npmjs.com/package/@immutable/artifacts)                                               | ABIs of all the main contracts needed for development                    |
| [`@immutable/tests-utils`](/packages/test-utils)                 | [![npm](https://img.shields.io/npm/v/@immutable/test-utils.svg)](https://www.npmjs.com/package/@immutable/test-utils)                 | Developer utilities                                             |
| [`@immutable/types`](/packages/types)                         | [![npm](https://img.shields.io/npm/v/@immutable/types.svg)](https://www.npmjs.com/package/@immutable/types)                         | Shared type declarations                                        |

### Private

|                       Package                        |              Description              |
| ---------------------------------------------------- | ------------------------------------- |
| [`@immutable/contracts`](/packages/contracts)       | Immutable smart contracts & tests   |
| [`@immutable/deployment`](/packages/deployment)       | Immutable contract deployment scripts   |
| [`@immutable/order-generator`](/packages/order-generator)                 | Order generator used for testing |


## Addresses :innocent:

We get it, you're just here to find the contract addresses. Luckily for you, they're all listed here.

### Contracts (Ropsten)

| Contract Name | Address |
| ------------- | ------- |
|  |  |


## Contributing :raising_hand_woman:
We appreciate your desire to contribute to the 8x Protocol. We strive to maintain
a high standard over code quality and the security of our contracts. Please read over
this contributor guide before starting.

### How to Contribute
If you would like to contribute please fork the repo, create a new branch, fix the problem, commit the work with a clear message about what was accomplished, and submit a pull request.

### Code Quality
- When adding functionality, please also add tests and make sure they pass
- When adding a new function, make sure to add comments that adhere to the format seen throughout the project
- When fixing conflicts please use `rebase`
- When updating your working branch with `upstream master` changes, please `rebase`
- Make sure there are no linter `warnings` or `errors`

##### Requirements
- Lerna

##### Pre Requisites
```
npm install -g lerna
npm install -g typescript@2.6.2
```

##### Compiling All Packages
```
lerna run build
```

##### Running All Tests
```
lerna run test
```